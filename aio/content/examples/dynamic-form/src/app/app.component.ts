// #docregion
import { Component } from '@angular/core';

import { QuestionService } from './question.service';
import { QuestionBase } from './question-base';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { DynamicFormComponent } from './dynamic-form.component';

@Component({
    selector: 'app-root',
    template: `
    <div>
      <h2>Job Application for Heroes</h2>
      <app-dynamic-form [questions]="questions$ | async"></app-dynamic-form>
    </div>
  `,
    providers: [QuestionService],
    standalone: true,
    imports: [DynamicFormComponent, AsyncPipe]
})
export class AppComponent {
  questions$: Observable<QuestionBase<any>[]>;

  constructor(service: QuestionService) {
    this.questions$ = service.getQuestions();
  }
}
