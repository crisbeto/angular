/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {resolveForwardRef} from '../../di';
import {RuntimeError, RuntimeErrorCode} from '../../errors';
import {Type} from '../../interface/type';
import {assertEqual} from '../../util/assert';
import {EMPTY_OBJ} from '../../util/empty';
import {getComponentDef, getDirectiveDef} from '../definition';
import {diPublicInInjector, getOrCreateNodeInjectorForNode} from '../di';
import {BindingAliasMap, DirectiveDef} from '../interfaces/definition';
import {TContainerNode, TElementContainerNode, TElementNode} from '../interfaces/node';
import {LView, TView} from '../interfaces/view';

/** Values that can be used to define a host directive. */
type HostDirectiveConfig = Type<unknown>|{
  directive: Type<unknown>;
  inputs?: string[];
  outputs?: string[];
};

type HostDirectiveAliasMap = {
  [publicName: string]: string
};

/**
 * This feature add the host directives behavior to a directive definition by patching a
 * function onto it. The expectation is that the runtime will invoke the function during
 * directive matching.
 *
 * For example:
 * ```ts
 * class ComponentWithHostDirective {
 *   static ɵcmp = defineComponent({
 *    type: ComponentWithHostDirective,
 *    features: [ɵɵHostDirectivesFeature([
 *      SimpleHostDirective,
 *      {directive: AdvancedHostDirective, inputs: ['foo: alias'], outputs: ['bar']},
 *    ])]
 *  });
 * }
 * ```
 *
 * @codeGenApi
 */
export function ɵɵHostDirectivesFeature(rawHostDirectives: HostDirectiveConfig[]|
                                        (() => HostDirectiveConfig[])) {
  return (definition: DirectiveDef<unknown>) => {
    definition.applyHostDirectives = applyHostDirectives;
    definition.hostDirectives =
        (Array.isArray(rawHostDirectives) ? rawHostDirectives : rawHostDirectives()).map(dir => {
          return typeof dir === 'function' ?
              {directive: resolveForwardRef(dir), inputs: EMPTY_OBJ, outputs: EMPTY_OBJ} :
              {
                directive: resolveForwardRef(dir.directive),
                inputs: bindingArrayToMap(dir.inputs),
                outputs: bindingArrayToMap(dir.outputs)
              };
        });
  };
}

function applyHostDirectives(
    matches: DirectiveDef<unknown>[], aliasMap: BindingAliasMap, def: DirectiveDef<unknown>,
    tView: TView, viewData: LView, tNode: TElementNode|TContainerNode|TElementContainerNode): void {
  if (def.hostDirectives !== null) {
    for (const hostDirectiveConfig of def.hostDirectives) {
      const {
        directive: hostDirectiveReference,
        inputs: exposedInputs,
        outputs: exposedOutputs,
      } = hostDirectiveConfig;
      const hostDirectiveDef = getDirectiveDef(hostDirectiveReference)!;

      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        validateHostDirective(
            hostDirectiveReference, hostDirectiveDef, exposedInputs, exposedOutputs, matches);
      }

      // Allows for the directive to be injected by the host.
      diPublicInInjector(
          getOrCreateNodeInjectorForNode(tNode, viewData), tView, hostDirectiveDef.type);

      // We need to patch the `declaredInputs` so that
      // `ngOnChanges` can map the properties correctly.
      patchDeclaredInputs(hostDirectiveDef.declaredInputs, exposedInputs);

      // Host directives execute before the host so that its host bindings can be overwritten.
      applyHostDirectives(matches, aliasMap, hostDirectiveDef, tView, viewData, tNode);
      aliasMap.set(hostDirectiveDef, hostDirectiveConfig);
    }
  }

  // Push the def itself at the end since it needs to execute after the host directives.
  matches.push(def);
}

/**
 * `ngOnChanges` has some leftover legacy ViewEngine behavior where the keys inside the
 * `SimpleChanges` event refers to the *declared* name of the input, not its public name or its
 * minified name. E.g. in `@Input('alias') foo: string`, the name in the `SimpleChanges` object
 * will always be `foo`, and not `alias` or the minified name of `foo` in apps using property
 * minification.
 *
 * This is achieved through the `DirectiveDef.declaredInputs` map that is constructed when the
 * definition is declared. When a property is written to the directive instance, the
 * `NgOnChangesFeature` will try to remap the property name being written to using the
 * `declaredInputs`.
 *
 * Since the host directive input remapping happens during directive matching, `declaredInputs`
 * won't contain the new alias that the input is available under. This function addresses the
 * issue by patching the host directive aliases to the `declaredInputs`. There is *not* a risk of
 * this patching accidentally introducing new inputs to the host directive, because `declaredInputs`
 * is used *only* by the `NgOnChangesFeature` when determining what name is used in the
 * `SimpleChanges` object which won't be reached if an input doesn't exist.
 */
function patchDeclaredInputs(
    declaredInputs: {[key: string]: string}, exposedInputs: HostDirectiveAliasMap): void {
  for (const publicName in exposedInputs) {
    if (exposedInputs.hasOwnProperty(publicName)) {
      const remappedPublicName = exposedInputs[publicName];
      const privateName = declaredInputs[publicName];

      // We *technically* shouldn't be able to hit this case since we can't have multiple
      // inputs on the same property and we have validations against conflicting aliases in
      // `validateMappings`, but if we somehow did, it would lead to `ngOnChanges` being invoked
      // with the wrong name. We have a non-user-friendly assertion here just in case.
      if ((typeof ngDevMode === 'undefined' || ngDevMode) &&
          declaredInputs.hasOwnProperty(remappedPublicName)) {
        assertEqual(
            declaredInputs[remappedPublicName], declaredInputs[publicName],
            `Conflicting host directive input alias ${publicName}.`);
      }

      declaredInputs[remappedPublicName] = privateName;
    }
  }
}

function bindingArrayToMap(bindings: string[]|undefined): HostDirectiveAliasMap {
  if (bindings === undefined || bindings.length === 0) {
    return EMPTY_OBJ;
  }

  const result: HostDirectiveAliasMap = {};

  for (let i = 1; i < bindings.length; i += 2) {
    result[bindings[i - 1]] = bindings[i];
  }

  return result;
}

function validateHostDirective(
    reference: Type<unknown>, def: DirectiveDef<any>|null, exposedInputs: HostDirectiveAliasMap,
    exposedOutputs: HostDirectiveAliasMap,
    matches: DirectiveDef<unknown>[]): asserts def is DirectiveDef<unknown> {
  if (def === null) {
    if (getComponentDef(reference) !== null) {
      throw new RuntimeError(
          RuntimeErrorCode.HOST_DIRECTIVE_COMPONENT,
          `Host directive ${reference.name} cannot be a component.`);
    }

    throw new RuntimeError(
        RuntimeErrorCode.HOST_DIRECTIVE_UNRESOLVABLE,
        `Could not resolve metadata for host directive ${reference.name}.`);
  }

  if (!def.standalone) {
    throw new RuntimeError(
        RuntimeErrorCode.HOST_DIRECTIVE_NOT_STANDALONE,
        `Host directive ${def.type.name} must be standalone.`);
  }

  if (matches.indexOf(def) > -1) {
    throw new RuntimeError(
        RuntimeErrorCode.DUPLICATE_DIRECTITVE,
        `Directive ${def.type.name} matches multiple times on the same element. ` +
            `Directives can only match an element once.`);
  }

  validateMappings('input', def.type.name, def.inputs, exposedInputs);
  validateMappings('output', def.type.name, def.outputs, exposedOutputs);
}

function validateMappings(
    type: 'input'|'output', className: string, bindings: Record<string, string>,
    hostDirectiveMappings: HostDirectiveAliasMap) {
  for (const publicName in hostDirectiveMappings) {
    if (hostDirectiveMappings.hasOwnProperty(publicName)) {
      if (!bindings.hasOwnProperty(publicName)) {
        throw new RuntimeError(
            RuntimeErrorCode.HOST_DIRECTIVE_UNDEFINED_BINDING,
            `Directive ${className} does not have an ${type} with a public name of ${publicName}.`);
      }

      const remappedPublicName = hostDirectiveMappings[publicName];

      if (bindings.hasOwnProperty(remappedPublicName) &&
          bindings[remappedPublicName] !== publicName) {
        throw new RuntimeError(
            RuntimeErrorCode.HOST_DIRECTIVE_CONFLICTING_ALIAS,
            `Cannot alias ${type} ${publicName} of host directive ${className} to ${
                remappedPublicName}, because it already has a different ${
                type} with the same public name.`);
      }
    }
  }
}
