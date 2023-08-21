// #docregion
import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QuestionBase } from './question-base';
import { NgSwitch, NgSwitchCase, NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-question',
    templateUrl: './dynamic-form-question.component.html',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgSwitch, NgSwitchCase, NgFor, NgIf]
})
export class DynamicFormQuestionComponent {
  @Input() question!: QuestionBase<string>;
  @Input() form!: FormGroup;
  get isValid() { return this.form.controls[this.question.key].valid; }
}
