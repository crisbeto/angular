/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ChangeDetectorRef} from '../change_detection/change_detector_ref';
import {Injector} from '../di/injector';
import {InjectFlags} from '../di/interface/injector';
import {ProviderToken} from '../di/provider_token';
import {EnvironmentInjector} from '../di/r3_injector';
import {RuntimeError, RuntimeErrorCode} from '../errors';
import {Type} from '../interface/type';
import {ComponentFactory as AbstractComponentFactory, ComponentRef as AbstractComponentRef} from '../linker/component_factory';
import {ComponentFactoryResolver as AbstractComponentFactoryResolver} from '../linker/component_factory_resolver';
import {createElementRef, ElementRef} from '../linker/element_ref';
import {NgModuleRef} from '../linker/ng_module_factory';
import {RendererFactory2} from '../render/api';
import {Sanitizer} from '../sanitization/sanitizer';
import {assertDefined, assertIndexInRange} from '../util/assert';
import {VERSION} from '../version';
import {NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR} from '../view/provider_flags';

import {assertComponentType} from './assert';
import {getComponentDef} from './definition';
import {diPublicInInjector, getOrCreateNodeInjectorForNode, NodeInjector} from './di';
import {throwProviderNotFoundError} from './errors_di';
import {registerPostOrderHooks} from './hooks';
import {reportUnknownPropertyError} from './instructions/element_validation';
import {addToViewTree, allocExpando, createLView, createTView, getOrCreateComponentTView, getOrCreateTNode, initTNodeFlags, instantiateRootComponent, invokeHostBindingsInCreationMode, locateHostElement, markAsComponentHost, markDirtyIfOnPush, registerHostBindingOpCodes, renderView, setInputsForProperty} from './instructions/shared';
import {ComponentDef, DirectiveDef, HostDirectiveDef, RenderFlags} from './interfaces/definition';
import {PropertyAliasValue, TContainerNode, TElementContainerNode, TElementNode, TNode, TNodeType} from './interfaces/node';
import {Renderer, RendererFactory} from './interfaces/renderer';
import {RElement, RNode} from './interfaces/renderer_dom';
import {CONTEXT, HEADER_OFFSET, LView, LViewFlags, TVIEW, TViewType} from './interfaces/view';
import {MATH_ML_NAMESPACE, SVG_NAMESPACE} from './namespaces';
import {createElementNode, writeDirectClass, writeDirectStyle} from './node_manipulation';
import {extractAttrsAndClassesFromSelector, stringifyCSSSelectorList} from './node_selector_matcher';
import {enterView, getCurrentTNode, getLView, leaveView, setSelectedIndex} from './state';
import {computeStaticStyling} from './styling/static_styling';
import {NO_CHANGE} from './tokens';
import {mergeHostAttrs, setUpAttributes} from './util/attrs_utils';
import {stringifyForError} from './util/stringify_utils';
import {getTNode} from './util/view_utils';
import {RootViewRef, ViewRef} from './view_ref';

export class ComponentFactoryResolver extends AbstractComponentFactoryResolver {
  /**
   * @param ngModule The NgModuleRef to which all resolved factories are bound.
   */
  constructor(private ngModule?: NgModuleRef<any>) {
    super();
  }

  override resolveComponentFactory<T>(component: Type<T>): AbstractComponentFactory<T> {
    ngDevMode && assertComponentType(component);
    const componentDef = getComponentDef(component)!;
    return new ComponentFactory(componentDef, this.ngModule);
  }
}

function toRefArray(map: {[key: string]: string}): {propName: string; templateName: string;}[] {
  const array: {propName: string; templateName: string;}[] = [];
  for (let nonMinified in map) {
    if (map.hasOwnProperty(nonMinified)) {
      const minified = map[nonMinified];
      array.push({propName: minified, templateName: nonMinified});
    }
  }
  return array;
}

function getNamespace(elementName: string): string|null {
  const name = elementName.toLowerCase();
  return name === 'svg' ? SVG_NAMESPACE : (name === 'math' ? MATH_ML_NAMESPACE : null);
}

/**
 * Injector that looks up a value using a specific injector, before falling back to the module
 * injector. Used primarily when creating components or embedded views dynamically.
 */
class ChainedInjector implements Injector {
  constructor(private injector: Injector, private parentInjector: Injector) {}

  get<T>(token: ProviderToken<T>, notFoundValue?: T, flags?: InjectFlags): T {
    const value = this.injector.get<T|typeof NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR>(
        token, NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR, flags);

    if (value !== NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR ||
        notFoundValue === (NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR as unknown as T)) {
      // Return the value from the root element injector when
      // - it provides it
      //   (value !== NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR)
      // - the module injector should not be checked
      //   (notFoundValue === NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR)
      return value as T;
    }

    return this.parentInjector.get(token, notFoundValue, flags);
  }
}

/**
 * ComponentFactory interface implementation.
 */
export class ComponentFactory<T> extends AbstractComponentFactory<T> {
  override selector: string;
  override componentType: Type<any>;
  override ngContentSelectors: string[];
  isBoundToModule: boolean;

  override get inputs(): {propName: string; templateName: string;}[] {
    return toRefArray(this.componentDef.inputs);
  }

  override get outputs(): {propName: string; templateName: string;}[] {
    return toRefArray(this.componentDef.outputs);
  }

  /**
   * @param componentDef The component definition.
   * @param ngModule The NgModuleRef to which the factory is bound.
   */
  constructor(private componentDef: ComponentDef<any>, private ngModule?: NgModuleRef<any>) {
    super();
    this.componentType = componentDef.type;
    this.selector = stringifyCSSSelectorList(componentDef.selectors);
    this.ngContentSelectors =
        componentDef.ngContentSelectors ? componentDef.ngContentSelectors : [];
    this.isBoundToModule = !!ngModule;
  }

  override create(
      injector: Injector, projectableNodes?: any[][]|undefined, rootSelectorOrNode?: any,
      environmentInjector?: NgModuleRef<any>|EnvironmentInjector|
      undefined): AbstractComponentRef<T> {
    environmentInjector = environmentInjector || this.ngModule;

    let realEnvironmentInjector = environmentInjector instanceof EnvironmentInjector ?
        environmentInjector :
        environmentInjector?.injector;

    if (realEnvironmentInjector && this.componentDef.getStandaloneInjector !== null) {
      realEnvironmentInjector = this.componentDef.getStandaloneInjector(realEnvironmentInjector) ||
          realEnvironmentInjector;
    }

    const rootViewInjector =
        realEnvironmentInjector ? new ChainedInjector(injector, realEnvironmentInjector) : injector;

    const rendererFactory = rootViewInjector.get(RendererFactory2, null);
    if (rendererFactory === null) {
      throw new RuntimeError(
          RuntimeErrorCode.RENDERER_NOT_FOUND,
          ngDevMode &&
              'Angular was not able to inject a renderer (RendererFactory2). ' +
                  'Likely this is due to a broken DI hierarchy. ' +
                  'Make sure that any injector used to create this component has a correct parent.');
    }
    const sanitizer = rootViewInjector.get(Sanitizer, null);

    const hostRenderer = rendererFactory.createRenderer(null, this.componentDef);
    // Determine a tag name used for creating host elements when this component is created
    // dynamically. Default to 'div' if this component did not specify any tag name in its selector.
    const elementName = this.componentDef.selectors[0][0] as string || 'div';
    const hostRNode = rootSelectorOrNode ?
        locateHostElement(hostRenderer, rootSelectorOrNode, this.componentDef.encapsulation) :
        createElementNode(
            rendererFactory.createRenderer(null, this.componentDef), elementName,
            getNamespace(elementName));

    const rootFlags = this.componentDef.onPush ? LViewFlags.Dirty | LViewFlags.IsRoot :
                                                 LViewFlags.CheckAlways | LViewFlags.IsRoot;

    // Create the root view. Uses empty TView and ContentTemplate.
    const rootTView = createTView(TViewType.Root, null, null, 1, 0, null, null, null, null, null);
    const rootLView = createLView(
        null, rootTView, null, rootFlags, null, null, rendererFactory, hostRenderer, sanitizer,
        rootViewInjector, null);

    // rootView is the parent when bootstrapping
    // TODO(misko): it looks like we are entering view here but we don't really need to as
    // `renderView` does that. However as the code is written it is needed because
    // `createRootComponentView` and `createRootComponent` both read global state. Fixing those
    // issues would allow us to drop this.
    enterView(rootLView);

    let component: T;
    let tElementNode: TElementNode;

    try {
      const hostTNode = createRootComponentTNode(rootLView, hostRNode);
      const allDirectives = [this.componentDef];
      let hostDirectiveMappings: WeakMap<DirectiveDef<unknown>, HostDirectiveDef>|null = null;

      if (this.componentDef.applyHostDirectives !== null) {
        hostDirectiveMappings = new WeakMap();
        this.componentDef.applyHostDirectives(
            rootLView[TVIEW], rootLView, hostTNode, this.componentDef, allDirectives,
            hostDirectiveMappings);
      }

      const componentView = createRootComponentView(
          hostTNode, hostRNode, this.componentDef, allDirectives, rootLView, rendererFactory,
          hostRenderer);
      if (hostRNode) {
        if (rootSelectorOrNode) {
          setUpAttributes(hostRenderer, hostRNode, ['ng-version', VERSION.full]);
        } else {
          // If host element is created as a part of this function call (i.e. `rootSelectorOrNode`
          // is not defined), also apply attributes and classes extracted from component selector.
          // Extract attributes and classes from the first selector only to match VE behavior.
          const {attrs, classes} =
              extractAttrsAndClassesFromSelector(this.componentDef.selectors[0]);
          if (attrs) {
            setUpAttributes(hostRenderer, hostRNode, attrs);
          }
          if (classes && classes.length > 0) {
            writeDirectClass(hostRenderer, hostRNode, classes.join(' '));
          }
        }
      }

      tElementNode = getTNode(rootTView, HEADER_OFFSET) as TElementNode;

      if (projectableNodes !== undefined) {
        const projection: (TNode|RNode[]|null)[] = tElementNode.projection = [];
        for (let i = 0; i < this.ngContentSelectors.length; i++) {
          const nodesforSlot = projectableNodes[i];
          // Projectable nodes can be passed as array of arrays or an array of iterables (ngUpgrade
          // case). Here we do normalize passed data structure to be an array of arrays to avoid
          // complex checks down the line.
          // We also normalize the length of the passed in projectable nodes (to match the number of
          // <ng-container> slots defined by a component).
          projection.push(nodesforSlot != null ? Array.from(nodesforSlot) : null);
        }
      }

      // TODO: should LifecycleHooksFeature and other host features be generated by the compiler and
      // executed here?
      // Angular 5 reference: https://stackblitz.com/edit/lifecycle-hooks-vcref
      component = createRootComponent(
          componentView, this.componentDef, allDirectives, hostDirectiveMappings, rootLView,
          [LifecycleHooksFeature]);
      renderView(rootTView, rootLView, null);
    } finally {
      leaveView();
    }

    return new ComponentRef(
        this.componentType, component, createElementRef(tElementNode, rootLView), rootLView,
        tElementNode);
  }
}

const componentFactoryResolver: ComponentFactoryResolver = new ComponentFactoryResolver();

/**
 * Creates a ComponentFactoryResolver and stores it on the injector. Or, if the
 * ComponentFactoryResolver
 * already exists, retrieves the existing ComponentFactoryResolver.
 *
 * @returns The ComponentFactoryResolver instance to use
 */
export function injectComponentFactoryResolver(): AbstractComponentFactoryResolver {
  return componentFactoryResolver;
}

/**
 * Represents an instance of a Component created via a {@link ComponentFactory}.
 *
 * `ComponentRef` provides access to the Component Instance as well other objects related to this
 * Component Instance and allows you to destroy the Component Instance via the {@link #destroy}
 * method.
 *
 */
export class ComponentRef<T> extends AbstractComponentRef<T> {
  override instance: T;
  override hostView: ViewRef<T>;
  override changeDetectorRef: ChangeDetectorRef;
  override componentType: Type<T>;

  constructor(
      componentType: Type<T>, instance: T, public location: ElementRef, private _rootLView: LView,
      private _tNode: TElementNode|TContainerNode|TElementContainerNode) {
    super();
    this.instance = instance;
    this.hostView = this.changeDetectorRef = new RootViewRef<T>(_rootLView);
    this.componentType = componentType;
  }

  override setInput(name: string, value: unknown): void {
    const inputData = this._tNode.inputs;
    let dataValue: PropertyAliasValue|undefined;
    if (inputData !== null && (dataValue = inputData[name])) {
      const lView = this._rootLView;
      setInputsForProperty(lView[TVIEW], lView, dataValue, name, value);
      markDirtyIfOnPush(lView, this._tNode.index);
    } else {
      if (ngDevMode) {
        const cmpNameForError = stringifyForError(this.componentType);
        let message =
            `Can't set value of the '${name}' input on the '${cmpNameForError}' component. `;
        message += `Make sure that the '${
            name}' property is annotated with @Input() or a mapped @Input('${name}') exists.`;
        reportUnknownPropertyError(message);
      }
    }
  }

  override get injector(): Injector {
    return new NodeInjector(this._tNode, this._rootLView);
  }

  override destroy(): void {
    this.hostView.destroy();
  }

  override onDestroy(callback: () => void): void {
    this.hostView.onDestroy(callback);
  }
}

/** Represents a HostFeature function. */
type HostFeature = (<T>(component: T, componentDef: ComponentDef<T>) => void);

// TODO: A hack to not pull in the NullInjector from @angular/core.
export const NULL_INJECTOR: Injector = {
  get: (token: any, notFoundValue?: any) => {
    throwProviderNotFoundError(token, 'NullInjector');
  }
};

function createRootComponentTNode(lView: LView, rNode: RNode): TElementNode {
  const tView = lView[TVIEW];
  const index = HEADER_OFFSET;
  ngDevMode && assertIndexInRange(lView, index);
  lView[index] = rNode;

  // '#host' is added here as we don't know the real host DOM name (we don't want to read it) and at
  // the same time we want to communicate the debug `TNode` that this is a special `TNode`
  // representing a host element.
  return getOrCreateTNode(tView, index, TNodeType.Element, '#host', null);
}

/**
 * Creates the root component view and the root component node.
 *
 * @param rNode Render host element.
 * @param rootComponentDef ComponentDef
 * @param rootView The parent view where the host node is stored
 * @param rendererFactory Factory to be used for creating child renderers.
 * @param hostRenderer The current renderer
 * @param sanitizer The sanitizer, if provided
 *
 * @returns Component view created
 */
function createRootComponentView(
    tNode: TElementNode, rNode: RElement|null, rootComponentDef: ComponentDef<any>,
    allDirectives: DirectiveDef<any>[], rootView: LView, rendererFactory: RendererFactory,
    hostRenderer: Renderer, sanitizer?: Sanitizer|null): LView {
  const tView = rootView[TVIEW];
  applyRootComponentStyling(allDirectives, tNode, rNode, hostRenderer);

  const viewRenderer = rendererFactory.createRenderer(rNode, rootComponentDef);
  const componentView = createLView(
      rootView, getOrCreateComponentTView(rootComponentDef), null,
      rootComponentDef.onPush ? LViewFlags.Dirty : LViewFlags.CheckAlways, rootView[tNode.index],
      tNode, rendererFactory, viewRenderer, sanitizer || null, null, null);

  if (tView.firstCreatePass) {
    diPublicInInjector(
        getOrCreateNodeInjectorForNode(tNode, rootView), tView, rootComponentDef.type);
    markAsComponentHost(tView, tNode);
    initTNodeFlags(tNode, rootView.length, allDirectives.length);
  }

  addToViewTree(rootView, componentView);

  // Store component view at node index, with node as the HOST
  return rootView[tNode.index] = componentView;
}

function applyRootComponentStyling(
    directives: DirectiveDef<any>[], tNode: TElementNode, rNode: RElement|null,
    hostRenderer: Renderer): void {
  for (const def of directives) {
    tNode.mergedAttrs = mergeHostAttrs(tNode.mergedAttrs, def.hostAttrs);
  }

  if (tNode.mergedAttrs !== null) {
    computeStaticStyling(tNode, tNode.mergedAttrs, true);
    if (rNode !== null) {
      setUpAttributes(hostRenderer, rNode, tNode.mergedAttrs);
      if (tNode.classes !== null) {
        writeDirectClass(hostRenderer, rNode, tNode.classes);
      }
      if (tNode.styles !== null) {
        writeDirectStyle(hostRenderer, rNode, tNode.styles);
      }
    }
  }
}

/**
 * Creates a root component and sets it up with features and host bindings.Shared by
 * renderComponent() and ViewContainerRef.createComponent().
 */
function createRootComponent<T>(
    componentView: LView, rootComponentDef: ComponentDef<T>, allDirectives: DirectiveDef<any>[],
    hostDirectiveMappings: WeakMap<DirectiveDef<unknown>, HostDirectiveDef>|null, rootLView: LView,
    hostFeatures: HostFeature[]|null): any {
  const tView = rootLView[TVIEW];
  const rootTNode = getCurrentTNode()!;
  ngDevMode && assertDefined(rootTNode, 'tNode should have been already created');

  // Create directive instance with factory() and store at next index in viewData
  const component =
      instantiateRootComponent(tView, rootLView, allDirectives, hostDirectiveMappings);

  // Root view only contains an instance of this component,
  // so we use a reference to that component instance as a context.
  componentView[CONTEXT] = rootLView[CONTEXT] = component;

  if (hostFeatures !== null) {
    for (const feature of hostFeatures) {
      feature(component, rootComponentDef);
    }
  }

  applyRootDirectives(rootLView, rootTNode, allDirectives);
  return component;
}

function applyRootDirectives(lView: LView, tNode: TNode, directives: DirectiveDef<any>[]): void {
  const tView = lView[TVIEW];
  let directiveIndex = tNode.directiveStart;

  for (const def of directives) {
    const instance = lView[directiveIndex];

    // We want to generate an empty QueryList for root content queries for backwards
    // compatibility with ViewEngine.
    if (def.contentQueries) {
      ngDevMode && assertDefined(tNode, 'TNode expected');
      def.contentQueries(RenderFlags.Create, instance, directiveIndex);
    }

    if (tView.firstCreatePass && (def.hostBindings !== null || def.hostAttrs !== null)) {
      setSelectedIndex(directiveIndex);
      registerHostBindingOpCodes(
          tView, tNode, lView, directiveIndex, allocExpando(tView, lView, def.hostVars, NO_CHANGE),
          def);
      invokeHostBindingsInCreationMode(def, instance);
    }

    directiveIndex++;
  }
}

/**
 * Used to enable lifecycle hooks on the root component.
 *
 * Include this feature when calling `renderComponent` if the root component
 * you are rendering has lifecycle hooks defined. Otherwise, the hooks won't
 * be called properly.
 *
 * Example:
 *
 * ```
 * renderComponent(AppComponent, {hostFeatures: [LifecycleHooksFeature]});
 * ```
 */
export function LifecycleHooksFeature(): void {
  const tNode = getCurrentTNode()!;
  ngDevMode && assertDefined(tNode, 'TNode is required');
  registerPostOrderHooks(getLView()[TVIEW], tNode);
}
