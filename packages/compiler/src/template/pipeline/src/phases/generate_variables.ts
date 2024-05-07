/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as o from '../../../../output/output_ast';
import * as ir from '../../ir';

import type {ComponentCompilationJob, ViewCompilationUnit} from '../compilation';

/**
 * Generate a preamble sequence for each view creation block and listener function which declares
 * any variables that be referenced in other operations in the block.
 *
 * Variables generated include:
 *   * a saved view context to be used to restore the current view in event listeners.
 *   * the context of the restored view within event listener handlers.
 *   * context variables from the current view as well as all parent views (including the root
 *     context if needed).
 *   * local references from elements within the current view and any lexical parents.
 *
 * Variables are generated here unconditionally, and may optimized away in future operations if it
 * turns out their values (and any side effects) are unused.
 */
export function generateVariables(job: ComponentCompilationJob): void {
  recursivelyProcessView(job.root, /* there is no parent scope for the root view */ null);
}

/**
 * Process the given `ViewCompilation` and generate preambles for it and any listeners that it
 * declares.
 *
 * @param `parentScope` a scope extracted from the parent view which captures any variables which
 *     should be inherited by this view. `null` if the current view is the root view.
 */
function recursivelyProcessView(view: ViewCompilationUnit, parentScope: Scope | null): void {
  // Extract a `Scope` from this view.
  const scope = getScopeForView(view, parentScope);

  for (const op of view.create) {
    switch (op.kind) {
      case ir.OpKind.Template:
        // Descend into child embedded views.
        recursivelyProcessView(view.job.views.get(op.xref)!, scope);
        break;
      case ir.OpKind.Projection:
        if (op.fallbackView !== null) {
          recursivelyProcessView(view.job.views.get(op.fallbackView)!, scope);
        }
        break;
      case ir.OpKind.RepeaterCreate:
        // Descend into child embedded views.
        recursivelyProcessView(view.job.views.get(op.xref)!, scope);
        if (op.emptyView) {
          recursivelyProcessView(view.job.views.get(op.emptyView)!, scope);
        }
        break;
      case ir.OpKind.Listener:
      case ir.OpKind.TwoWayListener:
        // Prepend variables to listener handler functions.
        insertVariableOps(op.handlerOps, generateVariablesInScopeForView(view, scope, true));
        break;
    }
  }

  insertVariableOps(view.update, generateVariablesInScopeForView(view, scope, false));
}

function insertVariableOps(ops: ir.OpList<ir.UpdateOp>, variables: GeneratedVariables): void {
  ops.prepend(variables.prepend);

  if (variables.localLetRefs !== null) {
    for (const op of ops) {
      // Local let references have to be inserted after their corresponding `storeLet` call.
      if (op.kind === ir.OpKind.StoreLet && variables.localLetRefs.has(op.target)) {
        ir.OpList.insertAfter<ir.UpdateOp>(variables.localLetRefs.get(op.target)!, op);
      }
    }
  }
}

/**
 * Lexical scope of a view, including a reference to its parent view's scope, if any.
 */
interface Scope {
  /**
   * `XrefId` of the view to which this scope corresponds.
   */
  view: ir.XrefId;

  viewContextVariable: ir.SemanticVariable;

  contextVariables: Map<string, ir.SemanticVariable>;

  aliases: Set<ir.AliasVariable>;

  /**
   * Local references collected from elements within the view.
   */
  references: Reference[];

  /**
   * Map of the ref to a `@let` declaration and the variable referring to it.
   */
  letReferences: Map<ir.XrefId, LetReference>;

  /**
   * `Scope` of the parent view, if any.
   */
  parent: Scope | null;
}

/**
 * Information needed about a local reference collected from an element within a view.
 */
interface Reference {
  /**
   * Name given to the local reference variable within the template.
   *
   * This is not the name which will be used for the variable declaration in the generated
   * template code.
   */
  name: string;

  /**
   * `XrefId` of the element-like node which this reference targets.
   *
   * The reference may be either to the element (or template) itself, or to a directive on it.
   */
  targetId: ir.XrefId;

  targetSlot: ir.SlotHandle;

  /**
   * A generated offset of this reference among all the references on a specific element.
   */
  offset: number;

  variable: ir.SemanticVariable;
}

/**
 * Information a reference to an `@let` declaration.
 */
interface LetReference {
  /** Slot in which the declaration is stored. */
  targetSlot: ir.SlotHandle;

  /** Variable referring to the declaration. */
  variable: ir.LetReferenceVariable;
}

/** A variable op initialized to a reference to a local let. */
type LocalLetVariable = ir.VariableOp<ir.UpdateOp> & {initializer: ir.LocalLetReferenceExpr};

/**
 * Tracks the variables that have been generated for a specific view.
 */
interface GeneratedVariables {
  /**
   * Variables that should be prepended before all the other instructions.
   */
  prepend: ir.VariableOp<ir.UpdateOp>[];

  /**
   * Map between let declarations and the local variables within the view that reference them.
   * Local let references are processed separately, because they need to be inserted after
   * the corresponding `storeLet` call, rather than prepended.
   */
  localLetRefs: Map<ir.XrefId, LocalLetVariable> | null;
}

/**
 * Process a view and generate a `Scope` representing the variables available for reference within
 * that view.
 */
function getScopeForView(view: ViewCompilationUnit, parent: Scope | null): Scope {
  const slotMap = new Map<ir.XrefId, ir.SlotHandle>();
  const scope: Scope = {
    view: view.xref,
    viewContextVariable: {
      kind: ir.SemanticVariableKind.Context,
      name: null,
      view: view.xref,
    },
    contextVariables: new Map<string, ir.SemanticVariable>(),
    aliases: view.aliases,
    references: [],
    letReferences: new Map<ir.XrefId, LetReference>(),
    parent,
  };

  for (const identifier of view.contextVariables.keys()) {
    scope.contextVariables.set(identifier, {
      kind: ir.SemanticVariableKind.Identifier,
      name: null,
      identifier,
    });
  }

  for (const op of view.create) {
    if (ir.hasConsumesSlotTrait(op)) {
      slotMap.set(op.xref, op.handle);
    }

    switch (op.kind) {
      case ir.OpKind.ElementStart:
      case ir.OpKind.Template:
        if (!Array.isArray(op.localRefs)) {
          throw new Error(`AssertionError: expected localRefs to be an array`);
        }

        // Record available local references from this element.
        for (let offset = 0; offset < op.localRefs.length; offset++) {
          scope.references.push({
            name: op.localRefs[offset].name,
            targetId: op.xref,
            targetSlot: op.handle,
            offset,
            variable: {
              kind: ir.SemanticVariableKind.Identifier,
              name: null,
              identifier: op.localRefs[offset].name,
            },
          });
        }
        break;
    }
  }

  for (const op of view.update) {
    if (op.kind === ir.OpKind.StoreLet) {
      if (!slotMap.has(op.target)) {
        throw new Error(`AssertionError: reference to unknown slot for @let ${op.target}`);
      }

      if (scope.letReferences.has(op.target)) {
        throw new Error(
          `AssertionError: reference to @let ${op.target} has already been processed`,
        );
      }

      scope.letReferences.set(op.target, {
        targetSlot: slotMap.get(op.target)!,
        variable: {
          kind: ir.SemanticVariableKind.LetReference,
          name: null,
          target: op.target,
          identifier: op.name,
          view: view.xref,
        },
      });
    }
  }

  return scope;
}

/**
 * Generate declarations for all variables that are in scope for a given view.
 *
 * This is a recursive process, as views inherit variables available from their parent view, which
 * itself may have inherited variables, etc.
 */
function generateVariablesInScopeForView(
  view: ViewCompilationUnit,
  scope: Scope,
  isListener: boolean,
): GeneratedVariables {
  const prepend: ir.VariableOp<ir.UpdateOp>[] = [];
  let localLetRefs: Map<ir.XrefId, LocalLetVariable> | null = null;

  if (scope.view !== view.xref) {
    // Before generating variables for a parent view, we need to switch to the context of the parent
    // view with a `nextContext` expression. This context switching operation itself declares a
    // variable, because the context of the view may be referenced directly.
    prepend.push(
      ir.createVariableOp(
        view.job.allocateXrefId(),
        scope.viewContextVariable,
        new ir.NextContextExpr(),
        ir.VariableFlags.None,
      ),
    );
  }

  // Add variables for all context variables available in this scope's view.
  const scopeView = view.job.views.get(scope.view)!;
  for (const [name, value] of scopeView.contextVariables) {
    const context = new ir.ContextExpr(scope.view);
    // We either read the context, or, if the variable is CTX_REF, use the context directly.
    const variable = value === ir.CTX_REF ? context : new o.ReadPropExpr(context, value);
    // Add the variable declaration.
    prepend.push(
      ir.createVariableOp(
        view.job.allocateXrefId(),
        scope.contextVariables.get(name)!,
        variable,
        ir.VariableFlags.None,
      ),
    );
  }

  for (const alias of scopeView.aliases) {
    prepend.push(
      ir.createVariableOp(
        view.job.allocateXrefId(),
        alias,
        alias.expression.clone(),
        ir.VariableFlags.AlwaysInline,
      ),
    );
  }

  // Add variables for all local references declared for elements in this scope.
  for (const ref of scope.references) {
    prepend.push(
      ir.createVariableOp(
        view.job.allocateXrefId(),
        ref.variable,
        new ir.ReferenceExpr(ref.targetId, ref.targetSlot, ref.offset),
        ir.VariableFlags.None,
      ),
    );
  }

  for (const [target, ref] of scope.letReferences) {
    const isLocalRef = scope.view === view.xref && !isListener;
    const letVarOp = ir.createVariableOp<ir.UpdateOp>(
      view.job.allocateXrefId(),
      ref.variable,
      isLocalRef
        ? new ir.LocalLetReferenceExpr(ref.targetSlot)
        : new ir.ContextLetReferenceExpr(target, ref.targetSlot),
      ir.VariableFlags.None,
    );

    if (isLocalRef) {
      localLetRefs ??= new Map();
      localLetRefs.set(target, letVarOp as LocalLetVariable);
    } else {
      prepend.push(letVarOp);
    }
  }

  if (scope.parent !== null) {
    // Recursively add variables from the parent scope. Local let references aren't inherited.
    const parentOps = generateVariablesInScopeForView(view, scope.parent, false);
    prepend.push(...parentOps.prepend);
  }
  return {prepend, localLetRefs};
}
