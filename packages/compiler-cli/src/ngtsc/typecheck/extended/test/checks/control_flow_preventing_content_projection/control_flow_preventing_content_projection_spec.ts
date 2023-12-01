/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {ErrorCode, ngErrorCode} from '../../../../../diagnostics';
import {absoluteFrom, getSourceFileOrError} from '../../../../../file_system';
import {runInEachFileSystem} from '../../../../../file_system/testing';
import {getSourceCodeForDiagnostic} from '../../../../../testing';
import {TemplateDiagnostic} from '../../../../api';
import {getClass, setup} from '../../../../testing';
import {factory as controlFlowPreventingContentProjectionFactory} from '../../../checks/control_flow_preventing_content_projection';
import {ExtendedTemplateCheckerImpl} from '../../../src/extended_template_checker';

runInEachFileSystem(() => {
  describe('ControlFlowPreventingContentProjectionFactory', () => {
    it('should report when an @if block prevents an element from being projected', () => {
      const diags = diagnose(['*', 'bar, [foo]'], `
        <comp>
          @if (true) {
            <div foo></div>
            breaks projection
          }
        </comp>
      `);
      expect(diags.length).toBe(1);
      expect(diags[0].category).toBe(ts.DiagnosticCategory.Warning);
      expect(diags[0].code).toBe(ngErrorCode(ErrorCode.CONTROL_FLOW_PREVENTING_CONTENT_PROJECTION));
      expect(diags[0].messageText)
          .toContain(
              `Node matches the "bar, [foo]" slot of the "Comp" component, but will ` +
              `not be projected into the specific slot because the surrounding @if has more than one node at its root.`);
      expect(getSourceCodeForDiagnostic(diags[0])).toBe(`<div foo></div>`);
    });

    it('should report when an @if block prevents a template from being projected', () => {
      const diags = diagnose(['*', 'bar, [foo]'], `
        <comp>
          @if (true) {
            <ng-template foo></ng-template>
            breaks projection
          }
        </comp>
      `);
      expect(diags.length).toBe(1);
      expect(diags[0].category).toBe(ts.DiagnosticCategory.Warning);
      expect(diags[0].code).toBe(ngErrorCode(ErrorCode.CONTROL_FLOW_PREVENTING_CONTENT_PROJECTION));
      expect(diags[0].messageText)
          .toContain(
              `Node matches the "bar, [foo]" slot of the "Comp" component, but will ` +
              `not be projected into the specific slot because the surrounding @if has more than one node at its root.`);
      expect(getSourceCodeForDiagnostic(diags[0])).toBe(`<ng-template foo></ng-template>`);
    });
  });

  function diagnose(ngContentSelectors: string[], template: string): TemplateDiagnostic[] {
    const fileName = absoluteFrom('/main.ts');
    const dirFile = absoluteFrom('/dir.ts');
    const {program, templateTypeChecker} = setup(
        [
          {
            fileName,
            templates: {'Host': template},
            declarations: [
              {
                name: 'Comp',
                selector: 'comp',
                isComponent: true,
                file: dirFile,
                type: 'directive',
                ngContentSelectors,
              },
            ]
          },
          {
            fileName: dirFile,
            source: 'export class Comp {}',
            templates: {},
          }
        ],
        {config: {enableTemplateTypeChecker: true}});
    const sf = getSourceFileOrError(program, fileName);
    const component = getClass(sf, 'Host');
    const extendedTemplateChecker = new ExtendedTemplateCheckerImpl(
        templateTypeChecker, program.getTypeChecker(),
        [controlFlowPreventingContentProjectionFactory], {enableTemplateTypeChecker: true});

    return extendedTemplateChecker.getDiagnosticsForComponent(component);
  }
});
