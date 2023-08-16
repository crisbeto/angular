import {Component} from '@angular/core';

@Component({
  template: `
    {#if value() === 2}
      top level
      {:else if value(); as alias}
        {#if value() > 0}
          {#if value() !== 7}{{alias}}{/if}
        {/if}
    {/if}
  `,
})
export class MyApp {
  value = () => 1;
}
