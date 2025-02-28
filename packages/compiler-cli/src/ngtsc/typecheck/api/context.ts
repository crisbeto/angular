/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {
  ParseError,
  ParseSourceFile,
  R3TargetBinder,
  SchemaMetadata,
  TmplAstNode,
} from '@angular/compiler';
import ts from 'typescript';

import {Reference} from '../../imports';
import {PipeMeta} from '../../metadata';
import {ClassDeclaration} from '../../reflection';

import {TemplateSourceMapping, TypeCheckableDirectiveMeta} from './api';

export interface TemplateContext {
  nodes: TmplAstNode[];
  sourceMapping: TemplateSourceMapping;
  file: ParseSourceFile;
  parseErrors: ParseError[] | null;
}

export interface HostBindingsContext {
  nodes: TmplAstNode[]; // TODO: should probably be just one node
  sourceMapping: TemplateSourceMapping;
}

/**
 * A currently pending type checking operation, into which templates for type-checking can be
 * registered.
 */
export interface TypeCheckContext {
  // TODO: rename this method since it's dealing with more than just templates.
  /**
   * Register a template to potentially be type-checked.
   *
   * Templates registered via `addTemplate` are available for checking, but might be skipped if
   * checking of that component is not required. This can happen for a few reasons, including if
   * the component was previously checked and the prior results are still valid.
   *
   * @param ref a `Reference` to the component class which yielded this template.
   * @param binder an `R3TargetBinder` which encapsulates the scope of this template, including all
   * available directives.
   * @param template the original template AST of this component.
   * @param pipes a `Map` of pipes available within the scope of this template.
   * @param schemas any schemas which apply to this template.
   * @param sourceMapping a `TemplateSourceMapping` instance which describes the origin of the
   * template text described by the AST.
   * @param file the `ParseSourceFile` associated with the template.
   * @param parseErrors the `ParseError`'s associated with the template.
   * @param isStandalone a boolean indicating whether the component is standalone.
   * @param preserveWhitespaces a boolean indicating whether the component's template preserves
   * whitespaces.
   */
  addTemplate(
    ref: Reference<ClassDeclaration<ts.ClassDeclaration>>,
    binder: R3TargetBinder<TypeCheckableDirectiveMeta>,
    templateContext: TemplateContext,
    hostBindingContext: HostBindingsContext | null,
    pipes: Map<string, PipeMeta>,
    schemas: SchemaMetadata[],
    isStandalone: boolean,
    preserveWhitespaces: boolean,
  ): void;
}

/**
 * Interface to trigger generation of type-checking code for a program given a new
 * `TypeCheckContext`.
 */
export interface ProgramTypeCheckAdapter {
  typeCheck(sf: ts.SourceFile, ctx: TypeCheckContext): void;
}
