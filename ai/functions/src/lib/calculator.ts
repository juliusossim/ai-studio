export interface CalculatorInput {
  a: number;
  b: number;
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
}

export const calculatorFunctionSchema = {
  name: 'calculator',
  description: 'Perform basic arithmetic operations on two numbers',
  parameters: {
    type: 'object',
    properties: {
      a: { type: 'number', description: 'First operand' },
      b: { type: 'number', description: 'Second operand' },
      operation: {
        type: 'string',
        enum: ['add', 'subtract', 'multiply', 'divide'],
        description: 'The arithmetic operation to perform',
      },
    },
    required: ['a', 'b', 'operation'],
  },
} as const;
