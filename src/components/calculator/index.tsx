"use client";

import { useAtom } from "jotai";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculatorAtom } from "@/stores/slices/calculator_store";
import { useCalculator } from "@/hooks/calculator";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export default function Calculator() {
  const [state] = useAtom(calculatorAtom);
  const {
    handleNumber,
    handleOperator,
    handleEquals,
    handleClear,
    handleScientific,
    handleMemory,
  } = useCalculator();
  const t = useTranslations("calculator");

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleNumber(e.key);
      } else if (["+", "-", "*", "/", "=", "Enter"].includes(e.key)) {
        if (e.key === "Enter") {
          handleEquals();
        } else {
          handleOperator(e.key);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleNumber, handleOperator, handleEquals]);

  return (
    <Card className="w-full max-w-md p-4 dark:bg-gray-800">
      <div className="mb-4">
        <Input
          value={state.display}
          readOnly
          className={cn(
            "text-right text-2xl",
            "dark:bg-gray-700 dark:text-white"
          )}
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Button
          variant="secondary"
          onClick={() => handleMemory("MC")}
          title={t("memory.mc")}
          className="dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          MC
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleMemory("MR")}
          title={t("memory.mr")}
          className="dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          MR
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleMemory("M+")}
          title={t("memory.mPlus")}
          className="dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          M+
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleMemory("M-")}
          title={t("memory.mMinus")}
          className="dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          M-
        </Button>

        <Button
          variant="outline"
          onClick={() => handleScientific("sin")}
          title={t("scientific.sin")}
          className="dark:border-gray-600 dark:hover:bg-gray-700"
        >
          sin
        </Button>
        <Button
          variant="outline"
          onClick={() => handleScientific("cos")}
          title={t("scientific.cos")}
          className="dark:border-gray-600 dark:hover:bg-gray-700"
        >
          cos
        </Button>
        <Button
          variant="outline"
          onClick={() => handleScientific("tan")}
          title={t("scientific.tan")}
          className="dark:border-gray-600 dark:hover:bg-gray-700"
        >
          tan
        </Button>
        <Button
          variant="outline"
          onClick={() => handleScientific("sqrt")}
          title={t("scientific.sqrt")}
          className="dark:border-gray-600 dark:hover:bg-gray-700"
        >
          √
        </Button>

        <Button
          variant="outline"
          onClick={() => handleScientific("log")}
          title={t("scientific.log")}
          className="dark:border-gray-600 dark:hover:bg-gray-700"
        >
          log
        </Button>
        <Button
          variant="outline"
          onClick={() => handleScientific("exp")}
          title={t("scientific.exp")}
          className="dark:border-gray-600 dark:hover:bg-gray-700"
        >
          exp
        </Button>
        <Button
          variant="outline"
          onClick={() => handleOperator("(")}
          className="dark:border-gray-600 dark:hover:bg-gray-700"
        >
          (
        </Button>
        <Button
          variant="outline"
          onClick={() => handleOperator(")")}
          className="dark:border-gray-600 dark:hover:bg-gray-700"
        >
          )
        </Button>

        <Button
          onClick={() => handleNumber("7")}
          className="dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          7
        </Button>
        <Button
          onClick={() => handleNumber("8")}
          className="dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          8
        </Button>
        <Button
          onClick={() => handleNumber("9")}
          className="dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          9
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleOperator("/")}
          title={t("operators.divide")}
          className="dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          /
        </Button>

        <Button
          onClick={() => handleNumber("4")}
          className="dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          4
        </Button>
        <Button
          onClick={() => handleNumber("5")}
          className="dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          5
        </Button>
        <Button
          onClick={() => handleNumber("6")}
          className="dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          6
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleOperator("*")}
          title={t("operators.multiply")}
          className="dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          ×
        </Button>

        <Button
          onClick={() => handleNumber("1")}
          className="dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          1
        </Button>
        <Button
          onClick={() => handleNumber("2")}
          className="dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          2
        </Button>
        <Button
          onClick={() => handleNumber("3")}
          className="dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          3
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleOperator("-")}
          title={t("operators.subtract")}
          className="dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          -
        </Button>

        <Button
          onClick={() => handleNumber("0")}
          className="dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          0
        </Button>
        <Button
          onClick={() => handleNumber(".")}
          className="dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          .
        </Button>
        <Button
          variant="destructive"
          onClick={handleClear}
          title={t("operators.clear")}
          className="dark:bg-red-700 dark:hover:bg-red-600"
        >
          C
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleOperator("+")}
          title={t("operators.add")}
          className="dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          +
        </Button>

        <Button
          className="col-span-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          onClick={handleEquals}
          title={t("operators.equals")}
        >
          =
        </Button>
      </div>
    </Card>
  );
}
