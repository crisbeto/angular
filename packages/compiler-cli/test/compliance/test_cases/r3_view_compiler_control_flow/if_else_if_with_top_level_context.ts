import {Component} from '@angular/core';

@Component({
  template: `
    <div>
      {{message}}
      {#if value() === 1; as alias}hello{:else if value() === 2}goodbye{:else}goodbye again{/if}
    </div>
  `,
})
export class MyApp {
  message = 'hello';
  value = () => 1;
}
