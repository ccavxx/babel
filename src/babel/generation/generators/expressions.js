import isNumber from "lodash/lang/isNumber";
import * as t from "../../types";

export function UnaryExpression(node, print) {
  var hasSpace = /[a-z]$/.test(node.operator);
  var arg = node.argument;

  if (t.isUpdateExpression(arg) || t.isUnaryExpression(arg)) {
    hasSpace = true;
  }

  if (t.isUnaryExpression(arg) && arg.operator === "!") {
    hasSpace = false;
  }

  this.push(node.operator);
  if (hasSpace) this.push(" ");
  print.plain(node.argument);
}

export function DoExpression(node, print) {
  this.push("do");
  this.space();
  print.plain(node.body);
}

export function UpdateExpression(node, print) {
  if (node.prefix) {
    this.push(node.operator);
    print.plain(node.argument);
  } else {
    print.plain(node.argument);
    this.push(node.operator);
  }
}

export function ConditionalExpression(node, print) {
  print.plain(node.test);
  this.space();
  this.push("?");
  this.space();
  print.plain(node.consequent);
  this.space();
  this.push(":");
  this.space();
  print.plain(node.alternate);
}

export function NewExpression(node, print) {
  this.push("new ");
  print.plain(node.callee);
  this.push("(");
  print.list(node.arguments);
  this.push(")");
}

export function SequenceExpression(node, print) {
  print.list(node.expressions);
}

export function ThisExpression() {
  this.push("this");
}

export function Super() {
  this.push("super");
}

export function Decorator(node, print) {
  this.push("@");
  print.plain(node.expression);
  this.newline();
}

export function CallExpression(node, print) {
  print.plain(node.callee);

  this.push("(");

  var separator = ",";

  var isPrettyCall = node._prettyCall && !this.format.retainLines;

  if (isPrettyCall) {
    separator += "\n";
    this.newline();
    this.indent();
  } else {
    separator += " ";
  }

  print.list(node.arguments, { separator: separator });

  if (isPrettyCall) {
    this.newline();
    this.dedent();
  }

  this.push(")");
}

var buildYieldAwait = function (keyword) {
  return function (node, print) {
    this.push(keyword);

    if (node.delegate || node.all) {
      this.push("*");
    }

    if (node.argument) {
      this.push(" ");
      print.plain(node.argument);
    }
  };
};

export var YieldExpression = buildYieldAwait("yield");
export var AwaitExpression = buildYieldAwait("await");

export function EmptyStatement() {
  this.semicolon();
}

export function ExpressionStatement(node, print) {
  print.plain(node.expression);
  this.semicolon();
}

export function AssignmentExpression(node, print) {
  // todo: add cases where the spaces can be dropped when in compact mode
  print.plain(node.left);
  this.push(" ");
  this.push(node.operator);
  this.push(" ");
  print.plain(node.right);
}

export function BindExpression(node, print) {
  print.plain(node.object);
  this.push("::");
  print.plain(node.callee);
}

export {
  AssignmentExpression as BinaryExpression,
  AssignmentExpression as LogicalExpression,
  AssignmentExpression as AssignmentPattern
};

export function MemberExpression(node, print) {
  var obj = node.object;
  print.plain(obj);

  if (!node.computed && t.isMemberExpression(node.property)) {
    throw new TypeError("Got a MemberExpression for MemberExpression property");
  }

  var computed = node.computed;
  if (t.isLiteral(node.property) && isNumber(node.property.value)) {
    computed = true;
  }

  if (computed) {
    this.push("[");
    print.plain(node.property);
    this.push("]");
  } else {
    this.push(".");
    print.plain(node.property);
  }
}

export function MetaProperty(node, print) {
  print.plain(node.meta);
  this.push(".");
  print.plain(node.property);
}
