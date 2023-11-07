/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {BoundTarget, ComponentMeta as BaseComponentMeta, DirectiveMeta as BaseDirectiveMeta, ParseSourceFile} from '@angular/compiler';

import {Reference} from '../../imports';
import {ClassDeclaration} from '../../reflection';

export interface DirectiveMeta extends BaseDirectiveMeta {
  ref: Reference<ClassDeclaration>;
  /**
   * Unparsed selector of the directive, or null if the directive does not have a selector.
   */
  selector: string|null;
}

export interface ComponentMeta extends BaseComponentMeta {
  ref: Reference<ClassDeclaration>;
  /**
   * Unparsed selector of the directive, or null if the directive does not have a selector.
   */
  selector: string|null;
}

/**
 * An intermediate representation of a component.
 */
export interface ComponentInfo {
  /** Component TypeScript class declaration */
  declaration: ClassDeclaration;

  /** Component template selector if it exists, otherwise null. */
  selector: string|null;

  /**
   * BoundTarget containing the parsed template. Can also be used to query for directives used in
   * the template.
   */
  boundTemplate: BoundTarget<DirectiveMeta, ComponentMeta>;

  /** Metadata about the template */
  templateMeta: {
    /** Whether the component template is inline */
    isInline: boolean;

    /** Template file recorded by template parser */
    file: ParseSourceFile;
  };
}

/**
 * A context for storing indexing information about components of a program.
 *
 * An `IndexingContext` collects component and template analysis information from
 * `DecoratorHandler`s and exposes them to be indexed.
 */
export class IndexingContext {
  readonly components = new Set<ComponentInfo>();

  /**
   * Adds a component to the context.
   */
  addComponent(info: ComponentInfo) {
    this.components.add(info);
  }
}
