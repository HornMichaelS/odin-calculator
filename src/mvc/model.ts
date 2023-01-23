import { CalculatorValue } from "./calculator_value";
import { Operator } from "./events";
import { View } from "./view";

export class Model {
  view!: View;

  private value?: string = "0";
  private register?: string;
  private shouldAppendDecimal = false;
  private isDisplayingResult = false;
  private continueOperation = false;
  selectedOperation?: Operator;

  get stringValue(): string {
    const value = this.value ?? this.register!;

    const parsed = parseFloat(value);

    if (
      parsed > 999999999 ||
      parsed < -99999999 ||
      (parsed !== 0 && Math.abs(parsed) < 0.000001)
    ) {
      return "Err";
    }

    return value;
  }

  appendDigit(digit: number) {
    if (
      (this.selectedOperation !== undefined && this.register === undefined) ||
      this.isDisplayingResult
    ) {
      this.register = this.value;
      this.value = undefined;
      this.isDisplayingResult = false;
    }

    if (this.value === undefined) {
      this.value = digit.toString();
    } else if (this.value.length < 9 && this.value !== "Err") {
      if (this.value === "0") {
        this.value = digit.toString();
      } else {
        this.value += digit.toString();
      }
    }

    this.view.modelDidUpdate(this);
  }

  appendDecimal() {
    if (
      (this.selectedOperation !== undefined && this.register === undefined) ||
      this.isDisplayingResult
    ) {
      this.register = this.value;
      this.value = "0.";
      this.isDisplayingResult = false;
    } else if (this.value === undefined) {
      this.value = "0.";
    } else if (!this.value.includes(".")) {
      this.value += ".";
    }

    this.view.modelDidUpdate(this);
  }

  didSelectOperator(op: Operator) {
    switch (op) {
      case Operator.div:
      case Operator.mul:
      case Operator.sub:
      case Operator.add:
        if (
          this.register === undefined ||
          this.selectedOperation !== op ||
          this.continueOperation
        ) {
          this.selectOperation(op);
        } else {
          this.performBinaryOperation(op);
        }
        break;
      case Operator.eq:
        if (this.selectedOperation !== undefined) {
          if (this.register === undefined) {
            this.register = this.value;
          } else if (this.value === undefined) {
            this.value = this.register;
          }

          this.performBinaryOperation(this.selectedOperation);
        }
        break;
      default:
        if (this.value === undefined) {
          this.value = this.register;
        }
        this.register = undefined;
        this.performUnaryOperation(op);
    }

    this.view.modelDidUpdate(this);
  }

  clear() {
    this.value = "0";
    this.register = undefined;
    this.selectedOperation = undefined;
    this.shouldAppendDecimal = false;
    this.view.modelDidUpdate(this);
  }

  private selectOperation(op: Operator) {
    this.selectedOperation = op;
    this.isDisplayingResult = true;
    this.continueOperation = false;
  }

  private performBinaryOperation(op: Operator) {
    let value = parseFloat(this.value!);
    let register = parseFloat(this.register!);

    switch (op) {
      case Operator.div:
        value = this.continueOperation ? value / register : register / value;
        break;
      case Operator.mul:
        value = register * value;
        break;
      case Operator.sub:
        value = this.continueOperation ? value - register : register - value;
        break;
      case Operator.add:
        value = register + value;
        break;
    }

    this.isDisplayingResult = true;

    if (!this.continueOperation) {
      this.register = this.value;
      this.continueOperation = true;
    }

    this.value = this.valueToString(value);
  }

  private performUnaryOperation(op: Operator) {
    let value = parseFloat(this.value!);

    switch (op) {
      case Operator.negate:
        value = -value;
        break;
      case Operator.percent:
        value = value / 100;
        break;
      default:
        break;
    }

    this.value = this.valueToString(value);
  }

  private valueToString(value: number): string {
    const precision = Math.abs(value) < 1 ? 8 : 9;

    let stringVal = value.toPrecision(precision);

    if (stringVal.includes(".")) {
      stringVal = stringVal.replace(/\.?0*$/, "");
    }

    return stringVal;
  }
}
