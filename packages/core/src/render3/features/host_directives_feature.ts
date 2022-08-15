/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Type} from '../../interface/type';
import {EMPTY_OBJ} from '../../util/empty';
import {getDirectiveDef} from '../definition';
import {diPublicInInjector, getOrCreateNodeInjectorForNode} from '../di';
import {DirectiveDef} from '../interfaces/definition';
import {TContainerNode, TElementContainerNode, TElementNode} from '../interfaces/node';
import {LView, TView} from '../interfaces/view';

/** Values that can be used to define a host directive. */
type HostDirectiveConfig = Type<unknown>|{
  directive: Type<unknown>;
  inputs?: string[];
  outputs?: string[];
};

type HostDirectiveDefinition = {
  directive: Type<unknown>; inputs: HostDirectiveMapping; outputs: HostDirectiveMapping;
};

type HostDirectiveMapping = {
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
              {directive: dir, inputs: EMPTY_OBJ, outputs: EMPTY_OBJ} :
              {
                directive: dir.directive,
                inputs: bindingArrayToMap(dir.inputs),
                outputs: bindingArrayToMap(dir.outputs)
              };
        });
  };
}


function applyHostDirectives(
    tView: TView, viewData: LView, tNode: TElementNode|TContainerNode|TElementContainerNode,
    def: DirectiveDef<unknown>, matches: any[],
    results: WeakMap<DirectiveDef<unknown>, HostDirectiveDefinition>): void {
  if (def.hostDirectives !== null) {
    // Iterate in reverse so the directive that declares
    // the host directives preserves its original order.
    for (let i = def.hostDirectives.length - 1; i > -1; i--) {
      const hostDirectiveDef = getDirectiveDef(def.hostDirectives[i].directive)!;

      // TODO: wording and formatting
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        if (hostDirectiveDef === null) {
          throw Error('No directive def on host directive');
        }

        if (!hostDirectiveDef.standalone) {
          throw new Error('Host directive must be standalone');
        }

        if (matches.indexOf(hostDirectiveDef) > -1) {
          throw new Error('Detected duplicate host directive');
        }
      }

      // Allows for the directive to be injected by the host.
      diPublicInInjector(
          getOrCreateNodeInjectorForNode(tNode, viewData), tView, hostDirectiveDef.type);

      // Host directives execute before the host so that its host bindings can be overwritten.
      matches.unshift(hostDirectiveDef);
      results.set(hostDirectiveDef, def.hostDirectives[i]);
      applyHostDirectives(tView, viewData, tNode, hostDirectiveDef, matches, results);
    }
  }
}

function bindingArrayToMap(bindings: string[]|undefined): HostDirectiveMapping {
  if (bindings === undefined || bindings.length === 0) {
    return EMPTY_OBJ;
  }

  const result: HostDirectiveMapping = {};

  for (let i = 1; i < bindings.length; i += 2) {
    result[bindings[i - 1]] = bindings[i];
  }

  return result;
}
