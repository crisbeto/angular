/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {RuntimeError, RuntimeErrorCode} from '../../errors';
import {TNodeType} from '../interfaces/node';
import {HEADER_OFFSET, LView} from '../interfaces/view';
import {getContextLView, getLView, getSelectedIndex, getTView, setCurrentTNode} from '../state';
import {load} from '../util/view_utils';
import {getOrCreateTNode} from './shared';
import {store} from './storage';

/** Object that indicates the value of a `@let` declaration that hasn't been initialized yet. */
const UNINITIALIZED_LET = {};

/**
 * Declares an `@let` at a specific data slot.
 *
 * @param index Index at which to declare the `@let`.
 *
 * @codeGenApi
 */
export function ɵɵdeclareLet(index: number): typeof ɵɵdeclareLet {
  const tView = getTView();
  const lView = getLView();
  const adjustedIndex = index + HEADER_OFFSET;
  const tNode = getOrCreateTNode(tView, adjustedIndex, TNodeType.LetDeclaration, null, null);
  setCurrentTNode(tNode, false);
  store(tView, lView, adjustedIndex, UNINITIALIZED_LET);
  return ɵɵdeclareLet;
}

/**
 * Instruction that stores the value of a `@let` declaration on the current view.
 *
 * @codeGenApi
 */
export function ɵɵstoreLet(value: unknown): void {
  const tView = getTView();
  const lView = getLView();
  const index = getSelectedIndex();
  store(tView, lView, index, value);
}

/**
 * Retrieves the value of a `@let` declaration defined within the same view.
 *
 * @param index Index of the declaration within the view.
 *
 * @codeGenApi
 */
export function ɵɵreadLocalLet<T>(index: number): T {
  return readLet(getLView(), index);
}

/**
 * Retrieves the value of a `@let` declaration defined within the same view.
 *
 * @param index Index of the declaration within the view.
 *
 * @codeGenApi
 */
export function ɵɵreadContextLet<T>(index: number): T {
  return readLet(getContextLView(), index);
}

/**
 * Reads a `@let` value from a specific view.
 * @param lView View in which the `@let` is defined.
 * @param index Index at which the value should be.
 */
function readLet<T>(lView: LView, index: number): T {
  const value = load<T>(lView, HEADER_OFFSET + index);

  if (value === UNINITIALIZED_LET) {
    throw new RuntimeError(
      RuntimeErrorCode.UNINITIALIZED_LET_ACCESS,
      'Attempting to access a @let declaration whose value is not available yet',
    );
  }

  return value;
}
