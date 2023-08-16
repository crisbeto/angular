import {Component} from '@angular/core';

@Component({
  template: `
    {#if expr1; as expr1Alias}
      expr1
      {:else if expr2} expr2
      {:else if expr3; as expr3Alias} expr3
      {:else if expr4} expr4
      {:else if expr5} expr5
      {:else} end
    {/if}
  `,
})
export class MyApp {
  expr1 = true;
  expr2 = true;
  expr3 = true;
  expr4 = true;
  expr5 = true;
}
