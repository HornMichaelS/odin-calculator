export class CalculatorValue {
  private _value = 0;

  isFloatingPoint = false;
  decimalPlaces = 0;

  get value() {
    return this._value;
  }

  set value(newValue: number) {
    this._value = newValue;

    if (this._value % 1 !== 0) {
      const str = this._value.toPrecision(9).split(".");
    } else {
      this.decimalPlaces = 0;
    }
  }

  get stringValue(): string {
    let fixed = this._value.toFixed(this.decimalPlaces);

    if (this.isFloatingPoint && this.decimalPlaces === 0) {
      fixed += ".";
    } else if (fixed.length > 9) {
      return this._value.toExponential(3);
    }

    return fixed;
  }

  appendDigit(digit: number) {
    if (this.value.toFixed(this.decimalPlaces).length >= 9) {
      return;
    }

    if (this._value < 0) {
      digit = -digit;
    }

    if (!this.isFloatingPoint) {
      this._value *= 10;
      this._value += digit;
    } else {
      this.decimalPlaces += 1;
      this._value += digit / Math.pow(10, this.decimalPlaces);
    }
  }

  appendDecimal() {
    if (this.value.toFixed(this.decimalPlaces).length >= 9) {
      return;
    }

    this.isFloatingPoint = true;
  }
}
