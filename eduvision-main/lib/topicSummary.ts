export interface TopicSummary {
  keyIdea: string;
  importantConcepts: string[];
  formulas: string[];
  commonMistakes: string[];
  whatToRemember: string;
}

export function getTopicSummary(topicTitle: string): TopicSummary {
  const t = (topicTitle || '').toLowerCase().trim();

  if (t.includes('stack') || t.includes('lifo')) {
    return {
      keyIdea: `A Stack is a linear data structure operating on Last-In, First-Out (LIFO). Elements are added (push) and removed (pop) strictly from the top in O(1) constant time.`,
      importantConcepts: [
        'LIFO Principle: The last element added is the first one removed.',
        'push(x): Adds item x to top of stack in O(1) time.',
        'pop(): Removes and returns top item in O(1) time.',
        'peek(): Inspects top item without removing it.',
      ],
      formulas: [
        'Time Complexity: Push O(1), Pop O(1), Peek O(1)',
        'Space Complexity: O(N) for N stacked elements',
      ],
      commonMistakes: [
        'Stack Underflow: Popping from an empty stack without checking is_empty().',
        'Stack Overflow: Exceeding maximum call stack limit in recursive calls.',
      ],
      whatToRemember: `Pushing and popping take O(1) constant time. Popping from an empty stack causes a Stack Underflow error!`,
    };
  }

  if (t.includes('matrix') || t.includes('linear') || t.includes('dot')) {
    return {
      keyIdea: `Matrix multiplication combines 2D arrays by calculating dot products of rows from Matrix A and columns from Matrix B.`,
      importantConcepts: [
        'Dimension Rule: Columns of A (m×n) must equal Rows of B (n×p).',
        'Result Dimensions: Matrix C has dimension (m×p).',
        'Identity Matrix I: Multiplying A × I leaves matrix A unchanged.',
        '2×2 Determinant: det([[a, b], [c, d]]) = ad - bc.',
      ],
      formulas: [
        'Dimension: (m × n) × (n × p) = (m × p)',
        'Time Complexity: O(N³) standard, O(N^2.81) Strassen',
      ],
      commonMistakes: [
        'Invalid Dimensions: Multiplying matrices with mismatched inner dimensions.',
        'Non-Commutative: A × B is NOT equal to B × A in general!',
      ],
      whatToRemember: `Matrix multiplication A (m×n) × B (n×p) is valid only when columns of A equal rows of B, producing an m×p matrix!`,
    };
  }

  if (t.includes('python') || t.includes('programming')) {
    return {
      keyIdea: `Python provides high-level built-in data structures (Lists, Dicts, Sets, Tuples) optimized for readable code and rapid execution.`,
      importantConcepts: [
        'List: Ordered, mutable dynamic array with O(1) append.',
        'Dictionary: Key-value hash map with O(1) average lookup.',
        'Set: Unordered collection of unique items with O(1) membership check.',
        'Tuple: Immutable ordered sequence.',
      ],
      formulas: [
        'List Append: O(1) amortized time',
        'Dict Lookup: O(1) average time',
      ],
      commonMistakes: [
        'Modifying List While Iterating: Causes skipped elements or index errors.',
        'Mutable Default Arguments: def foo(arr=[]): creates shared list across calls.',
      ],
      whatToRemember: `Dictionary key lookups and set membership checks run in O(1) average time; list appends run in amortized O(1) time!`,
    };
  }

  if (t.includes('ai') || t.includes('neural') || t.includes('machine learning') || t.includes('deep learning')) {
    return {
      keyIdea: `Neural Networks learn complex patterns by passing inputs through weighted layers and adjusting weights via Backpropagation and Gradient Descent.`,
      importantConcepts: [
        'Activation Function (ReLU/Sigmoid): Introduces non-linearity to learn complex functions.',
        'Backpropagation: Computes loss gradients using calculus chain rule.',
        'Gradient Descent: Iteratively updates weights to minimize loss.',
        'Overfitting: When a model memorizes training noise instead of general patterns.',
      ],
      formulas: [
        'ReLU: f(x) = max(0, x)',
        'Weight Update: W_new = W_old - (learning_rate * dL/dW)',
      ],
      commonMistakes: [
        'Omitting Activation Functions: Turns multi-layer network into a single linear regression model.',
        'Learning Rate Too High: Causes loss divergence instead of convergence.',
      ],
      whatToRemember: `Non-linear activation functions (ReLU/Sigmoid) are essential so multi-layer networks can fit complex non-linear functions!`,
    };
  }

  if (t.includes('sort') || t.includes('search') || t.includes('merge') || t.includes('tree') || t.includes('graph') || t.includes('dsa') || t.includes('algorithm')) {
    return {
      keyIdea: `Divide-and-conquer algorithms (like Merge Sort) break datasets into smaller halves, solve subproblems recursively, and merge results in O(N log N) time.`,
      importantConcepts: [
        'Binary Search: Halves search space on sorted arrays in O(log N) time.',
        'Merge Sort: Divide-and-conquer sorting running in guaranteed O(N log N) time.',
        'QuickSort: Partitioning algorithm averaging O(N log N) time.',
        'Call Stack Depth: Recursive partitioning uses O(log N) stack frames.',
      ],
      formulas: [
        'Merge Sort Time: O(N log N) best, average, and worst case',
        'Binary Search Time: O(log N)',
      ],
      commonMistakes: [
        'Binary Search on Unsorted Data: Returns incorrect results.',
        'Forgetting Base Case: Triggers infinite recursion.',
      ],
      whatToRemember: `Merge Sort guarantees O(N log N) time complexity across all cases (best, average, worst) with O(N) auxiliary space!`,
    };
  }

  if (t.includes('recursion') || t.includes('recursive')) {
    return {
      keyIdea: `Recursion breaks problems down into identical sub-problems until a terminal base case stops execution.`,
      importantConcepts: [
        'Base Case: The stopping condition that prevents infinite function calls.',
        'Recursive Step: Reduction step moving input closer to base case.',
        'Call Stack: Memory frames allocated for nested function calls.',
        'Stack Unwinding: Return phase propagating values back up stack.',
      ],
      formulas: [
        'Factorial: n! = n * (n - 1)! for n > 1; 1! = 1',
        'Fibonacci: Fib(n) = Fib(n-1) + Fib(n-2)',
      ],
      commonMistakes: [
        'Missing Base Case: Causes RecursionError (Stack Overflow).',
        'Incorrect Reduction: Input does not decrease toward base case.',
      ],
      whatToRemember: `Always define base cases FIRST to prevent infinite memory stack overflow!`,
    };
  }

  return {
    keyIdea: `Mastering ${topicTitle} involves understanding core data structures, algorithmic efficiency, and memory management.`,
    importantConcepts: [
      `Core Concepts: Essential principles governing ${topicTitle}.`,
      'Efficiency: Optimizing time and space complexity.',
      'Implementation: Writing clean, production-ready code.',
      'Edge Cases: Validating boundary conditions and error handling.',
    ],
    formulas: [
      'Time Complexity: Big O Notation evaluation O(1), O(N), O(N log N)',
      'Space Complexity: Auxiliary memory consumption',
    ],
    commonMistakes: [
      'Ignoring Boundary Conditions: Causes index errors or undefined behavior.',
      'Unoptimized Complexity: Using quadratic algorithms on large datasets.',
    ],
    whatToRemember: `Always analyze time complexity (Big O) and space complexity to ensure scalable, production-ready implementation of ${topicTitle}!`,
  };
}
