import { Component } from '@angular/core';
import { MyInputWithAttributeDecoratorComponent } from './my-input-with-attribute-decorator.component';
import { CompWithHostBindingComponent } from './comp-with-host-binding.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [CompWithHostBindingComponent, MyInputWithAttributeDecoratorComponent]
})
export class AppComponent {
  actionName = 'Create and set an attribute';
  isSpecial = true;
  canSave = true;
  classExpression = 'special clearance';
  styleExpression = 'border: solid red 3px';
  color = 'blue';
  border = '.5rem dashed black';
}
