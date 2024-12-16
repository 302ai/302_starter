import { Metadata } from "next";
import Calculator from "@/components/calculator";

export const metadata: Metadata = {
  title: "Scientific Calculator",
  description: "A scientific calculator built with Next.js and TailwindCSS",
};

export default function CalculatorPage() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <Calculator />
    </main>
  );
}
