import { Component, Directive, Input, TemplateRef, ContentChild, HostBinding, HostListener } from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';

@Directive({
    selector: 'button[appExampleZippyToggle]',
    standalone: true,
})
export class ZippyToggleDirective {
  @HostBinding('attr.aria-expanded') ariaExpanded = this.zippy.expanded;
  @HostBinding('attr.aria-controls') ariaControls = this.zippy.contentId;
  @HostListener('click') toggleZippy() {
    this.zippy.expanded = !this.zippy.expanded;
  }
  constructor(public zippy: ZippyComponent) {}
}

let nextId = 0;

// #docregion zippycontentdirective
@Directive({
    selector: '[appExampleZippyContent]',
    standalone: true
})
export class ZippyContentDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}
// #enddocregion zippycontentdirective

@Component({
    selector: 'app-example-zippy',
    templateUrl: 'example-zippy.template.html',
    standalone: true,
    imports: [NgIf, NgTemplateOutlet],
})
export class ZippyComponent {
  contentId = `zippy-${nextId++}`;
  @Input() expanded = false;
  // #docregion contentchild
  @ContentChild(ZippyContentDirective) content!: ZippyContentDirective;
  // #enddocregion contentchild
}
