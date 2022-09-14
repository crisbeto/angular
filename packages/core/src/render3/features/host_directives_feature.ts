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
import {EMPTY_OBJ} from '../../util/empty';
import {getComponentDef, getDirectiveDef} from '../definition';
import {diPublicInInjector, getOrCreateNodeInjectorForNode} from '../di';
import {DirectiveDef, HostDirectiveBindingMap, HostDirectiveDefinitionMap} from '../interfaces/definition';
import {TContainerNode, TElementContainerNode, TElementNode} from '../interfaces/node';
import {LView, TView} from '../interfaces/view';

/** Values that can be used to define a host directive through the `HostDirectivesFeature`. */
type HostDirectiveConfig = Type<unknown>|{
  directive: Type<unknown>;
  inputs?: string[];
  outputs?: string[];
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
    matches: DirectiveDef<unknown>[], definitionMap: HostDirectiveDefinitionMap,
    def: DirectiveDef<unknown>, tView: TView, viewData: LView,
    tNode: TElementNode|TContainerNode|TElementContainerNode): void {
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

      // Host directives execute before the host so that its host bindings can be overwritten.
      applyHostDirectives(matches, definitionMap, hostDirectiveDef, tView, viewData, tNode);
      definitionMap.set(hostDirectiveDef, hostDirectiveConfig);
    }
  }

  // Push the def itself at the end since it needs to execute after the host directives.
  matches.push(def);
}

/**
 * Converts an array in the form of `['publicName', 'alias', 'otherPublicName', 'otherAlias']` into
 * a map in the form of `{publicName: 'alias', otherPublicName: 'otherAlias'}`.
 */
function bindingArrayToMap(bindings: string[]|undefined): HostDirectiveBindingMap {
  if (bindings === undefined || bindings.length === 0) {
    return EMPTY_OBJ;
  }

  const result: HostDirectiveBindingMap = {};

  for (let i = 0; i < bindings.length; i += 2) {
    result[bindings[i]] = bindings[i + 1];
  }

  return result;
}

/**
 * Verifies that the host directive has been configured correctly.
 * @param type Reference to the class that defines the host directive.
 * @param def Directive definition of the host directive.
 * @param exposedInputs Inputs that have been exposed on the host.
 * @param exposedOutputs Outputs that have been exposed on the host.
 * @param matches Directives that have been matched so far.
 */
function validateHostDirective(
    type: Type<unknown>, def: DirectiveDef<any>|null, exposedInputs: HostDirectiveBindingMap,
    exposedOutputs: HostDirectiveBindingMap,
    matches: DirectiveDef<unknown>[]): asserts def is DirectiveDef<unknown> {
  if (def === null) {
    if (getComponentDef(type) !== null) {
      throw new RuntimeError(
          RuntimeErrorCode.HOST_DIRECTIVE_COMPONENT,
          `Host directive ${type.name} cannot be a component.`);
    }

    throw new RuntimeError(
        RuntimeErrorCode.HOST_DIRECTIVE_UNRESOLVABLE,
        `Could not resolve metadata for host directive ${type.name}.`);
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

  validateMappings('input', def, exposedInputs);
  validateMappings('output', def, exposedOutputs);
}

/**
 * Checks that the host directive inputs/outputs configuration is valid.
 * @param type Kind of binding that is being validated. Used in the error message.
 * @param def Definition of the host directive that is being validated against.
 * @param hostDirectiveMappings Host directive mapping object that shold be validated.
 */
function validateMappings(
    type: 'input'|'output', def: DirectiveDef<unknown>,
    hostDirectiveMappings: HostDirectiveBindingMap) {
  const className = def.type.name;
  const bindings: Record<string, string> = type === 'input' ? def.inputs : def.outputs;

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
