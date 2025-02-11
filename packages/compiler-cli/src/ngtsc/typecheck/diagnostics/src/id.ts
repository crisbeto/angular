/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import ts from 'typescript';
import {DeclarationNode} from '../../../reflection';

import {TemplateId} from '../../api';

const TEMPLATE_ID = Symbol('ngTemplateId');
const NEXT_TEMPLATE_ID = Symbol('ngNextTemplateId');
const HOST_BINDINGS_ID = Symbol('ngHostBindingsId');

interface HasIds {
  [TEMPLATE_ID]: TemplateId;
  [HOST_BINDINGS_ID]: TemplateId;
}

interface HasNextTemplateId {
  [NEXT_TEMPLATE_ID]: number;
}

export function getTemplateId(clazz: DeclarationNode): TemplateId {
  const node = clazz as ts.Declaration & Partial<HasIds>;
  if (node[TEMPLATE_ID] === undefined) {
    node[TEMPLATE_ID] = allocateTemplateId(node.getSourceFile());
  }
  return node[TEMPLATE_ID]!;
}

// TODO: rename `TemplateId`?
export function getHostBindingsId(clazz: DeclarationNode): TemplateId {
  const node = clazz as ts.Declaration & Partial<HasIds>;
  if (node[HOST_BINDINGS_ID] === undefined) {
    node[HOST_BINDINGS_ID] = allocateTemplateId(node.getSourceFile());
  }
  return node[HOST_BINDINGS_ID]!;
}

function allocateTemplateId(sf: ts.SourceFile & Partial<HasNextTemplateId>): TemplateId {
  if (sf[NEXT_TEMPLATE_ID] === undefined) {
    sf[NEXT_TEMPLATE_ID] = 1;
  }
  return `tcb${sf[NEXT_TEMPLATE_ID]!++}` as TemplateId;
}
