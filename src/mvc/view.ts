import { Controller } from "./controller";
import { Operator } from "./events";
import { Model } from "./model";

export class View {
  controller: Controller;

  constructor(controller: Controller) {
    this.controller = controller;

    this.init();
  }

  private init() {
    const buttons = document.querySelectorAll(
      ".calc-button"
    ) as NodeListOf<HTMLInputElement>;

    buttons.forEach((button) => {
      button.onclick = (e) => this.handleButtonClicked(button);
    });

    document.body.onkeydown = (e) => this.handleKeyDown(e);
    document.body.onkeyup = (e) => this.handleKeyUp(e);
  }

  private handleKeyDown(e: KeyboardEvent) {
    const elem = this.elemForKey(e);

    if (elem !== null) {
      elem.classList.add("active");
      this.handleButtonClicked(elem as HTMLInputElement);
    }
  }

  private handleKeyUp(e: KeyboardEvent) {
    document.querySelectorAll(".active").forEach((elem) => {
      elem.classList.remove("active");
    });
  }

  private elemForKey(e: KeyboardEvent): HTMLElement | null {
    console.log(`${e.altKey ? "Alt+" : ""}${e.key}`);
    switch (e.key) {
      case "Escape":
        return document.getElementById("clr");
      case "-":
      case "–":
        return e.altKey
          ? document.getElementById("negate")
          : document.getElementById("sub");
      case "%":
        return document.getElementById("percent");
      case "/":
        return document.getElementById("div");
      case "*":
        return document.getElementById("mul");
      case "+":
        return document.getElementById("add");
      case "=":
      case "Enter":
        return document.getElementById("eq");
      default:
        return document.getElementById(e.key);
    }

    return null;
  }

  private handleButtonClicked(button: HTMLInputElement) {
    const type =
      button.getAttribute("calc-button-type") ??
      button.parentElement?.getAttribute("calc-button-type");

    switch (type) {
      case "num":
        const value = parseInt(button.innerText);
        this.controller.dispatch({ type: "number_pressed", value });
        break;
      case "clr":
        this.controller.dispatch({ type: "clear_pressed" });
        break;
      case "dec":
        this.controller.dispatch({ type: "decimal_pressed" });
        break;
      case "op":
        const operatorText = button.id;
        let operator = this.parseOperator(operatorText);
        this.controller.dispatch({ type: "operator_pressed", operator });
        break;
    }
  }

  async modelDidUpdate(model: Model) {
    const display = document.getElementById("display")!;

    display.innerText = "";

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 80);
    });

    const elem = document.querySelector(".calc-button-selected");
    elem?.classList.remove("calc-button-selected");

    if (model.selectedOperation != null) {
      switch (model.selectedOperation) {
        case Operator.div:
          document.getElementById("div")?.classList.add("calc-button-selected");
          break;
        case Operator.mul:
          document.getElementById("mul")?.classList.add("calc-button-selected");
          break;
        case Operator.sub:
          document.getElementById("sub")?.classList.add("calc-button-selected");
          break;
        case Operator.add:
          document.getElementById("add")?.classList.add("calc-button-selected");
          break;
      }
    }

    display.innerText = model.stringValue;
  }

  private parseOperator(name: string): Operator {
    switch (name) {
      case "negate":
        return Operator.negate;
      case "percent":
        return Operator.percent;
      case "div":
        return Operator.div;
      case "mul":
        return Operator.mul;
      case "sub":
        return Operator.sub;
      case "add":
        return Operator.add;
      default:
        return Operator.eq;
    }
  }
}
