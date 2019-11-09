/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {assertDefined} from '../util/assert';

import {bindingUpdated, bindingUpdated2, bindingUpdated3, bindingUpdated4, getBinding, updateBinding} from './bindings';
import {pureFunction1Internal, pureFunction2Internal, pureFunction3Internal, pureFunction4Internal, pureFunctionVInternal} from './instructions/shared';
import {PureFunction0, PureFunction1, PureFunction2, PureFunction3, PureFunction4, PureFunction5, PureFunction6, PureFunction7, PureFunction8, PureFunctionV} from './interfaces/definition';
import {TVIEW} from './interfaces/view';
import {getBindingRoot, getLView} from './state';
import {NO_CHANGE} from './tokens';
import {getConstant} from './util/view_utils';


/**
 * Bindings for pure functions are stored after regular bindings.
 *
 * |-------decls------|---------vars---------|                 |----- hostVars (dir1) ------|
 * ------------------------------------------------------------------------------------------
 * | nodes/refs/pipes | bindings | fn slots  | injector | dir1 | host bindings | host slots |
 * ------------------------------------------------------------------------------------------
 *                    ^                      ^
 *      TView.bindingStartIndex      TView.expandoStartIndex
 *
 * Pure function instructions are given an offset from the binding root. Adding the offset to the
 * binding root gives the first index where the bindings are stored. In component views, the binding
 * root is the bindingStartIndex. In host bindings, the binding root is the expandoStartIndex +
 * any directive instances + any hostVars in directives evaluated before it.
 *
 * See VIEW_DATA.md for more information about host binding resolution.
 */

/**
 * If the value hasn't been saved, calls the pure function to store and return the
 * value. If it has been saved, returns the saved value.
 *
 * @param slotOffset the offset from binding root to the reserved slot
 * @param pureFnIndex Index of the pure function inside the constants array
 * @param thisArg Optional calling context of pureFn
 * @returns value
 *
 * @codeGenApi
 */
export function ɵɵpureFunction0(slotOffset: number, pureFnIndex: number, thisArg?: any): any {
  const bindingIndex = getBindingRoot() + slotOffset;
  const lView = getLView();
  const pureFn = getConstant<PureFunction0>(lView[TVIEW].consts, pureFnIndex) !;
  ngDevMode && assertDefined(pureFn, `Expected pure function at index ${pureFnIndex}`);
  return lView[bindingIndex] === NO_CHANGE ?
      updateBinding(lView, bindingIndex, thisArg ? pureFn.call(thisArg) : pureFn()) :
      getBinding(lView, bindingIndex);
}

/**
 * If the value of the provided exp has changed, calls the pure function to return
 * an updated value. Or if the value has not changed, returns cached value.
 *
 * @param slotOffset the offset from binding root to the reserved slot
 * @param pureFn Function that returns an updated value
 * @param exp Updated expression value
 * @param thisArg Optional calling context of pureFn
 * @returns Updated or cached value
 *
 * @codeGenApi
 */
export function ɵɵpureFunction1(
    slotOffset: number, pureFnIndex: number, exp: any, thisArg?: any): any {
  const lView = getLView();
  const pureFn = getConstant<PureFunction1>(lView[TVIEW].consts, pureFnIndex) !;
  ngDevMode && assertDefined(pureFn, `Expected pure function at index ${pureFnIndex}`);
  return pureFunction1Internal(lView, getBindingRoot(), slotOffset, pureFn, exp, thisArg);
}

/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param slotOffset the offset from binding root to the reserved slot
 * @param pureFnIndex Index of the pure function inside the constants array
 * @param exp1
 * @param exp2
 * @param thisArg Optional calling context of pureFn
 * @returns Updated or cached value
 *
 * @codeGenApi
 */
export function ɵɵpureFunction2(
    slotOffset: number, pureFnIndex: number, exp1: any, exp2: any, thisArg?: any): any {
  const lView = getLView();
  const pureFn = getConstant<PureFunction2>(lView[TVIEW].consts, pureFnIndex) !;
  ngDevMode && assertDefined(pureFn, `Expected pure function at index ${pureFnIndex}`);
  return pureFunction2Internal(lView, getBindingRoot(), slotOffset, pureFn, exp1, exp2, thisArg);
}

/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param slotOffset the offset from binding root to the reserved slot
 * @param pureFnIndex Index of the pure function inside the constants array
 * @param exp1
 * @param exp2
 * @param exp3
 * @param thisArg Optional calling context of pureFn
 * @returns Updated or cached value
 *
 * @codeGenApi
 */
export function ɵɵpureFunction3(
    slotOffset: number, pureFnIndex: number, exp1: any, exp2: any, exp3: any, thisArg?: any): any {
  const lView = getLView();
  const pureFn = getConstant<PureFunction3>(lView[TVIEW].consts, pureFnIndex) !;
  ngDevMode && assertDefined(pureFn, `Expected pure function at index ${pureFnIndex}`);
  return pureFunction3Internal(
      lView, getBindingRoot(), slotOffset, pureFn, exp1, exp2, exp3, thisArg);
}

/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param slotOffset the offset from binding root to the reserved slot
 * @param pureFnIndex Index of the pure function inside the constants array
 * @param exp1
 * @param exp2
 * @param exp3
 * @param exp4
 * @param thisArg Optional calling context of pureFn
 * @returns Updated or cached value
 *
 * @codeGenApi
 */
export function ɵɵpureFunction4(
    slotOffset: number, pureFnIndex: number, exp1: any, exp2: any, exp3: any, exp4: any,
    thisArg?: any): any {
  const lView = getLView();
  const pureFn = getConstant<PureFunction4>(lView[TVIEW].consts, pureFnIndex) !;
  ngDevMode && assertDefined(pureFn, `Expected pure function at index ${pureFnIndex}`);
  return pureFunction4Internal(
      lView, getBindingRoot(), slotOffset, pureFn, exp1, exp2, exp3, exp4, thisArg);
}

/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param slotOffset the offset from binding root to the reserved slot
 * @param pureFnIndex Index of the pure function inside the constants array
 * @param exp1
 * @param exp2
 * @param exp3
 * @param exp4
 * @param exp5
 * @param thisArg Optional calling context of pureFn
 * @returns Updated or cached value
 *
 * @codeGenApi
 */
export function ɵɵpureFunction5(
    slotOffset: number, pureFnIndex: number, exp1: any, exp2: any, exp3: any, exp4: any, exp5: any,
    thisArg?: any): any {
  const bindingIndex = getBindingRoot() + slotOffset;
  const lView = getLView();
  const different = bindingUpdated4(lView, bindingIndex, exp1, exp2, exp3, exp4);
  const pureFn = getConstant<PureFunction5>(lView[TVIEW].consts, pureFnIndex) !;
  ngDevMode && assertDefined(pureFn, `Expected pure function at index ${pureFnIndex}`);
  return bindingUpdated(lView, bindingIndex + 4, exp5) || different ?
      updateBinding(
          lView, bindingIndex + 5, thisArg ? pureFn.call(thisArg, exp1, exp2, exp3, exp4, exp5) :
                                             pureFn(exp1, exp2, exp3, exp4, exp5)) :
      getBinding(lView, bindingIndex + 5);
}

/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param slotOffset the offset from binding root to the reserved slot
 * @param pureFnIndex Index of the pure function inside the constants array
 * @param exp1
 * @param exp2
 * @param exp3
 * @param exp4
 * @param exp5
 * @param exp6
 * @param thisArg Optional calling context of pureFn
 * @returns Updated or cached value
 *
 * @codeGenApi
 */
export function ɵɵpureFunction6(
    slotOffset: number, pureFnIndex: number, exp1: any, exp2: any, exp3: any, exp4: any, exp5: any,
    exp6: any, thisArg?: any): any {
  const bindingIndex = getBindingRoot() + slotOffset;
  const lView = getLView();
  const different = bindingUpdated4(lView, bindingIndex, exp1, exp2, exp3, exp4);
  const pureFn = getConstant<PureFunction6>(lView[TVIEW].consts, pureFnIndex) !;
  ngDevMode && assertDefined(pureFn, `Expected pure function at index ${pureFnIndex}`);
  return bindingUpdated2(lView, bindingIndex + 4, exp5, exp6) || different ?
      updateBinding(
          lView, bindingIndex + 6, thisArg ?
              pureFn.call(thisArg, exp1, exp2, exp3, exp4, exp5, exp6) :
              pureFn(exp1, exp2, exp3, exp4, exp5, exp6)) :
      getBinding(lView, bindingIndex + 6);
}

/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param slotOffset the offset from binding root to the reserved slot
 * @param pureFnIndex Index of the pure function inside the constants array
 * @param exp1
 * @param exp2
 * @param exp3
 * @param exp4
 * @param exp5
 * @param exp6
 * @param exp7
 * @param thisArg Optional calling context of pureFn
 * @returns Updated or cached value
 *
 * @codeGenApi
 */
export function ɵɵpureFunction7(
    slotOffset: number, pureFnIndex: number, exp1: any, exp2: any, exp3: any, exp4: any, exp5: any,
    exp6: any, exp7: any, thisArg?: any): any {
  const bindingIndex = getBindingRoot() + slotOffset;
  const lView = getLView();
  let different = bindingUpdated4(lView, bindingIndex, exp1, exp2, exp3, exp4);
  const pureFn = getConstant<PureFunction7>(lView[TVIEW].consts, pureFnIndex) !;
  ngDevMode && assertDefined(pureFn, `Expected pure function at index ${pureFnIndex}`);
  return bindingUpdated3(lView, bindingIndex + 4, exp5, exp6, exp7) || different ?
      updateBinding(
          lView, bindingIndex + 7, thisArg ?
              pureFn.call(thisArg, exp1, exp2, exp3, exp4, exp5, exp6, exp7) :
              pureFn(exp1, exp2, exp3, exp4, exp5, exp6, exp7)) :
      getBinding(lView, bindingIndex + 7);
}

/**
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param slotOffset the offset from binding root to the reserved slot
 * @param pureFnIndex Index of the pure function inside the constants array
 * @param exp1
 * @param exp2
 * @param exp3
 * @param exp4
 * @param exp5
 * @param exp6
 * @param exp7
 * @param exp8
 * @param thisArg Optional calling context of pureFn
 * @returns Updated or cached value
 *
 * @codeGenApi
 */
export function ɵɵpureFunction8(
    slotOffset: number, pureFnIndex: number, exp1: any, exp2: any, exp3: any, exp4: any, exp5: any,
    exp6: any, exp7: any, exp8: any, thisArg?: any): any {
  const bindingIndex = getBindingRoot() + slotOffset;
  const lView = getLView();
  const different = bindingUpdated4(lView, bindingIndex, exp1, exp2, exp3, exp4);
  const pureFn = getConstant<PureFunction8>(lView[TVIEW].consts, pureFnIndex) !;
  ngDevMode && assertDefined(pureFn, `Expected pure function at index ${pureFnIndex}`);
  return bindingUpdated4(lView, bindingIndex + 4, exp5, exp6, exp7, exp8) || different ?
      updateBinding(
          lView, bindingIndex + 8, thisArg ?
              pureFn.call(thisArg, exp1, exp2, exp3, exp4, exp5, exp6, exp7, exp8) :
              pureFn(exp1, exp2, exp3, exp4, exp5, exp6, exp7, exp8)) :
      getBinding(lView, bindingIndex + 8);
}

/**
 * pureFunction instruction that can support any number of bindings.
 *
 * If the value of any provided exp has changed, calls the pure function to return
 * an updated value. Or if no values have changed, returns cached value.
 *
 * @param slotOffset the offset from binding root to the reserved slot
 * @param pureFnIndex Index of the pure function inside the constants array
 * @param exps An array of binding values
 * @param thisArg Optional calling context of pureFn
 * @returns Updated or cached value
 *
 * @codeGenApi
 */
export function ɵɵpureFunctionV(
    slotOffset: number, pureFnIndex: number, exps: any[], thisArg?: any): any {
  const lView = getLView();
  const pureFn = getConstant<PureFunctionV>(lView[TVIEW].consts, pureFnIndex) !;
  ngDevMode && assertDefined(pureFn, `Expected pure function at index ${pureFnIndex}`);
  return pureFunctionVInternal(lView, getBindingRoot(), slotOffset, pureFn, exps, thisArg);
}
