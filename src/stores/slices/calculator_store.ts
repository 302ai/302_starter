import { atom } from "jotai";

interface CalculatorState {
  display: string;
  memory: number;
  history: string[];
  currentNumber: string;
  operator: string | null;
  previousNumber: string | null;
  waitingForOperand: boolean;
}

export const calculatorAtom = atom<CalculatorState>({
  display: "0",
  memory: 0,
  history: [],
  currentNumber: "",
  operator: null,
  previousNumber: null,
  waitingForOperand: false,
});
