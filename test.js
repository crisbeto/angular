const ts = require('typescript');

const sf = ts.createSourceFile(
  'test',
  `
  console.log(a ** b ** c);
`,
  ts.ScriptTarget.Latest,
);

const printer = ts.createPrinter();

const left = ts.factory.createBinaryExpression(
  ts.factory.createIdentifier('a'),
  ts.SyntaxKind.AsteriskAsteriskToken,
  ts.factory.createIdentifier('b'),
);

const expr = ts.factory.createBinaryExpression(
  left,
  ts.SyntaxKind.AsteriskAsteriskToken,
  ts.factory.createIdentifier('c'),
);

sf.forEachChild(function walk(node) {
  if (ts.isBinaryExpression(node)) {
    console.log(JSON.stringify(node, undefined, 2));
    console.log('------------------------');
  }

  node.forEachChild(walk);
});

// console.log('synthetic', expr.flags);

// console.log(printer.printNode(ts.EmitHint.Expression, expr, sf));
// console.log(printer.printFile(sf));
