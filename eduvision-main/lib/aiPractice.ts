export interface AIPracticeProblem {
  id: string;
  title: string;
  category: 'Activation Functions' | 'Linear Algebra' | 'Optimization' | 'Loss Functions' | 'Neural Networks';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  starterCode: string;
  solutionCode: string;
  testCases: Array<{ input: any[]; expected: any; description: string }>;
  hints: string[];
  lineDiagnostics: Record<string, { line: number; message: string; hint: string }>;
}

export const AI_PRACTICE_PROBLEMS: AIPracticeProblem[] = [
  {
    id: 'ai_relu',
    title: '1. Implement ReLU Activation Function',
    category: 'Activation Functions',
    difficulty: 'Beginner',
    description: 'Write a Python function `relu(x)` that computes the Rectified Linear Unit activation. If `x > 0`, return `x`. Otherwise, return `0`.',
    starterCode: `def relu(x):
    # Write your code here
    pass

# Test your function
print("relu(5):", relu(5))
print("relu(-3):", relu(-3))`,
    solutionCode: `def relu(x):
    return max(0, x)`,
    testCases: [
      { input: [5], expected: 5, description: 'relu(5) should return 5' },
      { input: [-3], expected: 0, description: 'relu(-3) should return 0' },
      { input: [0], expected: 0, description: 'relu(0) should return 0' },
    ],
    hints: [
      'Use max(0, x) or an if-statement: if x > 0: return x else: return 0.',
    ],
    lineDiagnostics: {
      'pass': { line: 3, message: 'Line 3 contains unhandled pass placeholder.', hint: 'Replace pass with return max(0, x) or an if-else statement.' },
      'return x': { line: 3, message: 'Line 3 returns x unconditionally without checking for negative inputs.', hint: 'For negative values, relu must return 0. Use max(0, x).' },
      'return 0': { line: 3, message: 'Line 3 returns 0 unconditionally for all inputs.', hint: 'Positive inputs should return x unchanged!' },
    },
  },
  {
    id: 'ai_matrix_dot',
    title: '2. 2x2 Matrix Multiplication (Linear Algebra)',
    category: 'Linear Algebra',
    difficulty: 'Intermediate',
    description: 'Write a Python function `matrix_multiply(A, B)` that multiplies two 2x2 matrices A and B and returns the 2x2 result matrix C.',
    starterCode: `def matrix_multiply(A, B):
    # Write your code here
    pass

A = [[1, 2], [3, 4]]
B = [[5, 6], [7, 8]]
print("A x B:", matrix_multiply(A, B))`,
    solutionCode: `def matrix_multiply(A, B):
    return [
        [A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],
        [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]]
    ]`,
    testCases: [
      {
        input: [[[1, 2], [3, 4]], [[5, 6], [7, 8]]],
        expected: [[19, 22], [43, 50]],
        description: 'Multiplication of [[1,2],[3,4]] x [[5,6],[7,8]]',
      },
    ],
    hints: ['Each element C[i][j] is the dot product of row i from A and column j from B.'],
    lineDiagnostics: {
      'pass': { line: 3, message: 'Line 3: Function body contains unhandled pass statement.', hint: 'Compute dot products of row A[i] and column B[j].' },
    },
  },
  {
    id: 'ai_weight_update',
    title: '3. Gradient Descent Weight Update',
    category: 'Optimization',
    difficulty: 'Beginner',
    description: 'Write a Python function `update_weight(w, lr, grad)` that updates a model weight using Gradient Descent: `w_new = w - (lr * grad)`.',
    starterCode: `def update_weight(w, lr, grad):
    # Write your code here
    pass

print("New Weight:", update_weight(1.0, 0.01, 0.5))`,
    solutionCode: `def update_weight(w, lr, grad):
    return w - (lr * grad)`,
    testCases: [
      { input: [1.0, 0.01, 0.5], expected: 0.995, description: 'update_weight(1.0, 0.01, 0.5) should return 0.995' },
      { input: [2.0, 0.1, 1.0], expected: 1.9, description: 'update_weight(2.0, 0.1, 1.0) should return 1.9' },
    ],
    hints: ['Subtract learning rate times gradient from current weight w.'],
    lineDiagnostics: {
      'pass': { line: 3, message: 'Line 3: Replace pass placeholder with return w - (lr * grad).', hint: 'Gradient descent subtracts (lr * grad) from w.' },
    },
  },
  {
    id: 'ai_sigmoid',
    title: '4. Sigmoid Activation Function',
    category: 'Activation Functions',
    difficulty: 'Intermediate',
    description: 'Write a Python function `sigmoid(x)` that calculates `1 / (1 + e^-x)`. Return value rounded to 4 decimal places.',
    starterCode: `import math

def sigmoid(x):
    # Write your code here
    pass

print("sigmoid(0):", sigmoid(0))`,
    solutionCode: `import math

def sigmoid(x):
    return round(1 / (1 + math.exp(-x)), 4)`,
    testCases: [
      { input: [0], expected: 0.5, description: 'sigmoid(0) should return 0.5' },
      { input: [2], expected: 0.8808, description: 'sigmoid(2) should return 0.8808' },
    ],
    hints: ['Use math.exp(-x) to calculate e^(-x) and round result to 4 decimal places.'],
    lineDiagnostics: {
      'pass': { line: 5, message: 'Line 5: Missing sigmoid calculation.', hint: 'Use 1 / (1 + math.exp(-x)).' },
    },
  },
  {
    id: 'ai_mse',
    title: '5. Mean Squared Error (MSE) Loss',
    category: 'Loss Functions',
    difficulty: 'Intermediate',
    description: 'Write a Python function `mse(y_true, y_pred)` that calculates the average squared error between list of actual `y_true` and predicted `y_pred`.',
    starterCode: `def mse(y_true, y_pred):
    # Write your code here
    pass

print("MSE:", mse([1, 2, 3], [1, 1, 5]))`,
    solutionCode: `def mse(y_true, y_pred):
    total = sum((t - p) ** 2 for t, p in zip(y_true, y_pred))
    return round(total / len(y_true), 4)`,
    testCases: [
      { input: [[1, 2, 3], [1, 1, 5]], expected: 1.6667, description: 'mse([1,2,3], [1,1,5]) should return 1.6667' },
    ],
    hints: ['Compute sum of (y_t - y_p)^2 divided by number of samples.'],
    lineDiagnostics: {
      'pass': { line: 3, message: 'Line 3: Implement mean squared error calculation.', hint: 'Sum (t - p)**2 for all pairs and divide by N.' },
    },
  },
];
