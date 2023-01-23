export interface NumberPressed {
  type: "number_pressed";
  value: number;
}

export interface OperatorPressed {
  type: "operator_pressed";
  operator: Operator;
}

export interface DecimalPressed {
  type: "decimal_pressed";
}

export interface ClearPressed {
  type: "clear_pressed";
}

export type CalculatorEvent =
  | NumberPressed
  | OperatorPressed
  | DecimalPressed
  | ClearPressed;

export enum Operator {
  div,
  mul,
  sub,
  add,
  eq,
  negate,
  percent,
}
