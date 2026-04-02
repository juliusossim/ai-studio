export interface CalculatorInput {
  a: number;
  b: number;
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
}

export interface ToolResult {
  success: boolean;
  data: unknown;
  error?: string;
}

export function calculator({ a, b, operation }: CalculatorInput): ToolResult {
  switch (operation) {
    case 'add':
      return { success: true, data: a + b };
    case 'subtract':
      return { success: true, data: a - b };
    case 'multiply':
      return { success: true, data: a * b };
    case 'divide':
      if (b === 0) {
        return { success: false, data: null, error: 'Division by zero' };
      }
      return { success: true, data: a / b };
  }
}
