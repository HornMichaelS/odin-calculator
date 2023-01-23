import { CalculatorEvent } from "./events";
import { Model } from "./model";
import { View } from "./view";

export class Controller {
  model: Model = new Model();
  view: View = new View(this);

  init() {
    this.model.view = this.view;
  }

  dispatch(event: CalculatorEvent) {
    switch (event.type) {
      case "number_pressed":
        this.model.appendDigit(event.value);
        break;
      case "clear_pressed":
        this.model.clear();
        break;
      case "decimal_pressed":
        this.model.appendDecimal();
        break;
      case "operator_pressed":
        this.model.didSelectOperator(event.operator);
        break;
    }
  }
}
