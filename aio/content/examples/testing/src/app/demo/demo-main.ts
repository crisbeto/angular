// main app entry point
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { demoProviders, MasterService, ValueService, TestProvidersComponent, BankAccountComponent, BankAccountParentComponent, LightswitchComponent, Child1Component, Child2Component, Child3Component, InputComponent, InputValueBinderComponent, ParentComponent, IoComponent, IoParentComponent, MyIfComponent, TestViewProvidersComponent, ExternalTemplateComponent, InnerCompWithExternalTemplateComponent, NeedsContentComponent, MyIfChildComponent, MyIfParentComponent, ReversePipeComponent, ShellComponent, DemoComponent, demoDeclarations, InputValueBinderDirective, ReversePipe, Hero } from './demo';
import { BrowserModule, provideProtractorTestingSupport, bootstrapApplication } from '@angular/platform-browser';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Injectable, Component, Directive, HostBinding, Input, Output, EventEmitter, HostListener, Pipe, PipeTransform, OnInit, OnChanges, OnDestroy, SimpleChanges, ContentChildren, Optional, importProvidersFrom } from '@angular/core';

const r = '';
const prop = changes[propName];
const cur  = JSON.stringify(prop.currentValue);
const prev = JSON.stringify(prop.previousValue);



bootstrapApplication(DemoComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, ...demoDeclarations),
        ...demoProviders,
        provideProtractorTestingSupport()
    ]
});
