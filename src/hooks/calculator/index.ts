import { useAtom } from "jotai";
import { calculatorAtom } from "@/stores/slices/calculator_store";

export function useCalculator() {
  const [, setState] = useAtom(calculatorAtom);

  const handleNumber = (num: string) => {
    setState((prev) => {
      if (prev.waitingForOperand) {
        return {
          ...prev,
          display: num,
          currentNumber: num,
          waitingForOperand: false,
        };
      }
      const newDisplay = prev.display === "0" ? num : prev.display + num;
      return {
        ...prev,
        display: newDisplay,
        currentNumber: newDisplay,
      };
    });
  };

  const handleOperator = (op: string) => {
    setState((prev) => {
      if (prev.operator && !prev.waitingForOperand) {
        const result = calculate(
          parseFloat(prev.previousNumber || "0"),
          parseFloat(prev.currentNumber || "0"),
          prev.operator
        );
        return {
          ...prev,
          display: result.toString(),
          previousNumber: result.toString(),
          currentNumber: result.toString(),
          operator: op,
          waitingForOperand: true,
          history: [
            ...prev.history,
            `${prev.previousNumber} ${prev.operator} ${prev.currentNumber} = ${result}`,
          ],
        };
      }
      return {
        ...prev,
        previousNumber: prev.currentNumber || prev.display,
        operator: op,
        waitingForOperand: true,
      };
    });
  };

  const handleEquals = () => {
    setState((prev) => {
      if (!prev.operator || !prev.previousNumber) return prev;
      const result = calculate(
        parseFloat(prev.previousNumber),
        parseFloat(prev.currentNumber || prev.previousNumber),
        prev.operator
      );
      return {
        ...prev,
        display: result.toString(),
        previousNumber: null,
        currentNumber: result.toString(),
        operator: null,
        waitingForOperand: true,
        history: [
          ...prev.history,
          `${prev.previousNumber} ${prev.operator} ${prev.currentNumber} = ${result}`,
        ],
      };
    });
  };

  const handleClear = () => {
    setState((prev) => ({
      ...prev,
      display: "0",
      currentNumber: "",
      previousNumber: null,
      operator: null,
      waitingForOperand: false,
    }));
  };

  const handleScientific = (func: string) => {
    setState((prev) => {
      const number = parseFloat(prev.display);
      let result: number;

      switch (func) {
        case "sin":
          result = Math.sin(number);
          break;
        case "cos":
          result = Math.cos(number);
          break;
        case "tan":
          result = Math.tan(number);
          break;
        case "log":
          result = Math.log10(number);
          break;
        case "exp":
          result = Math.exp(number);
          break;
        case "sqrt":
          result = Math.sqrt(number);
          break;
        default:
          return prev;
      }

      return {
        ...prev,
        display: result.toString(),
        currentNumber: result.toString(),
        waitingForOperand: true,
        history: [...prev.history, `${func}(${number}) = ${result}`],
      };
    });
  };

  const handleMemory = (action: string) => {
    setState((prev) => {
      switch (action) {
        case "MC":
          return { ...prev, memory: 0 };
        case "MR":
          return {
            ...prev,
            display: prev.memory.toString(),
            currentNumber: prev.memory.toString(),
            waitingForOperand: true,
          };
        case "M+":
          return {
            ...prev,
            memory: prev.memory + parseFloat(prev.display),
          };
        case "M-":
          return {
            ...prev,
            memory: prev.memory - parseFloat(prev.display),
          };
        default:
          return prev;
      }
    });
  };

  const calculate = (a: number, b: number, operator: string): number => {
    switch (operator) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return b !== 0 ? a / b : 0;
      default:
        return b;
    }
  };

  return {
    handleNumber,
    handleOperator,
    handleEquals,
    handleClear,
    handleScientific,
    handleMemory,
  };
}
