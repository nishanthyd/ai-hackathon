import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      topic = 'Recursion',
      prompt = '',
      action = 'chat',
      timestamp = '',
      socraticMode = false,
      difficulty = 'Intermediate',
      apiKey: clientApiKey,
      messages: chatHistory = [],
    } = body;

    // Use client-provided API key from settings/localStorage if present, or process.env
    const apiKey = clientApiKey || process.env.GROQ_API_KEY || process.env.AI_API_KEY;

    if (apiKey && apiKey.trim().length > 5) {
      try {
        let systemInstruction = socraticMode
          ? `You are LearnAI's Socratic AI Tutor for "${topic}" (${difficulty} level).
DO NOT give direct answers immediately. Guide the student with 1 short, insightful follow-up question.`
          : `You are LearnAI's ChatGPT-style AI Tutor for "${topic}" (${difficulty} level).

PROGRESSIVE DISCLOSURE RULES (CHATGPT CHATTING STYLE):
1. Keep initial explanations SHORT, CRISP, and HIGH-YIELD (under 120 words). DO NOT over-explain!
2. Give the core idea in 1-2 bullet points or 1 clean paragraph + quick real-world analogy.
3. Only include code blocks if the user explicitly asks for code, examples, or implementation.
4. When generating quiz questions, generate 1 NEW, unique check-in question on "${topic}" that has NOT been asked previously in the conversation history!
5. DO NOT reveal which option is correct upfront! List 4 options (A, B, C, D) and ask the student to choose A, B, C, or D.
6. If the user replies with a letter (A, B, C, D), evaluate their choice and explain why it is correct or incorrect.

CRITICAL FORMATTING RULES:
- DO NOT use LaTeX math blocks like \\[\\] or \\begin{cases}. Write clean text math like \`n! = n * (n-1)!\`.
- Use bolding for key terms and bullet points for readability.`;

        // Format multi-turn conversation history for Groq/OpenAI schema
        const formattedHistory = Array.isArray(chatHistory)
          ? chatHistory
              .filter((m: any) => m && m.text && m.sender)
              .map((m: any) => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text,
              }))
          : [];

        let userMessage = prompt;
        if (action === 'simplify') userMessage = `Explain ${topic} in super simple terms (ELI5) for a ${difficulty} level student in 2-3 short sentences with a fun analogy.`;
        if (action === 'example') userMessage = `Give a short Python code example for ${topic} with 2 bullet points explaining how it works.`;
        if (action === 'visual') userMessage = `Provide a short step-by-step visual ASCII diagram for ${topic}.`;
        if (action === 'quiz') userMessage = `Generate 1 NEW, unique check-in question on ${topic} with 4 options (A, B, C, D). DO NOT repeat any previous question! DO NOT label which option is correct!`;

        const messagesToSend = [
          { role: 'system', content: systemInstruction },
          ...formattedHistory,
        ];

        const lastMsg = formattedHistory[formattedHistory.length - 1];
        if (!lastMsg || lastMsg.content !== userMessage) {
          messagesToSend.push({ role: 'user', content: userMessage });
        }

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey.trim()}`,
          },
          body: JSON.stringify({
            model: 'openai/gpt-oss-120b',
            messages: messagesToSend,
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.choices?.[0]?.message?.content || 'I am here to help you learn!';
          return NextResponse.json({ success: true, reply, source: 'groq_llm' });
        } else {
          const errText = await res.text();
          console.warn('Groq API response error:', res.status, errText);
        }
      } catch (err: any) {
        console.warn('Groq API call exception, using demo engine:', err.message);
      }
    }

    // ==========================================
    // Dynamic ChatGPT-Style Fallback Engine
    // ==========================================
    // ==========================================
    // Dynamic ChatGPT-Style Fallback Engine
    // ==========================================
    const p = prompt.toLowerCase().trim();
    const tLower = topic.toLowerCase().trim();
    const isDetailedRequest = p.includes('code') || p.includes('more') || p.includes('example') || p.includes('detail') || p.includes('implement') || p.includes('how to');

    // Extract previous questions asked in this chat session to prevent duplicates
    const askedQuestions = new Set<string>();
    if (Array.isArray(chatHistory)) {
      chatHistory.forEach((m: any) => {
        if (m && m.text) {
          const match = m.text.match(/\*\*(.*?)\?\*\*/);
          if (match && match[1]) askedQuestions.add(match[1]);
        }
      });
    }

    // Defined Topic-Specific Quiz Pools
    const matrixQuizPool = [
      {
        question: "What is the required condition to multiply matrix A (size m×n) by matrix B (size p×q)?",
        options: [
          "A) m must equal q",
          "B) n must equal p (columns of A = rows of B)",
          "C) Both matrices must be square",
          "D) m must equal p"
        ],
        correct: "B",
        explanation: "Matrix multiplication A × B is valid only when the number of columns in A equals the number of rows in B."
      },
      {
        question: "What is the Time Complexity of standard N×N Matrix Multiplication?",
        options: [
          "A) O(N) linear time",
          "B) O(N log N)",
          "C) O(N^3) cubic time",
          "D) O(N^2) quadratic time"
        ],
        correct: "C",
        explanation: "Standard matrix multiplication calculates N^2 entries, each taking N multiplications, yielding O(N^3) complexity."
      },
      {
        question: "What is the Identity Matrix I?",
        options: [
          "A) A matrix filled entirely with 0s",
          "B) A square matrix with 1s on the main diagonal and 0s elsewhere",
          "C) A matrix filled entirely with 1s",
          "D) A matrix with negative values"
        ],
        correct: "B",
        explanation: "Multiplying any matrix A by the Identity Matrix I leaves A unchanged: A × I = A."
      },
      {
        question: "What is the determinant of a 2×2 matrix [[a, b], [c, d]]?",
        options: [
          "A) ad - bc",
          "B) ac - bd",
          "C) ab + cd",
          "D) ad + bc"
        ],
        correct: "A",
        explanation: "The determinant of a 2x2 matrix [[a, b], [c, d]] is computed as (a*d - b*c)."
      }
    ];

    const pythonQuizPool = [
      {
        question: "Which built-in Python data structure is mutable and ordered?",
        options: [
          "A) Tuple",
          "B) List",
          "C) String",
          "D) FrozenSet"
        ],
        correct: "B",
        explanation: "Lists in Python are mutable (elements can be modified) and ordered by index position."
      },
      {
        question: "What is the average Time Complexity of looking up a key in a Python dictionary?",
        options: [
          "A) O(N) linear time",
          "B) O(1) constant time",
          "C) O(N^2)",
          "D) O(log N)"
        ],
        correct: "B",
        explanation: "Python dictionaries use hash tables, providing O(1) average time complexity for key lookups."
      },
      {
        question: "What does the 'pass' statement do in Python?",
        options: [
          "A) Exits a loop immediately",
          "B) Acts as a null placeholder that does nothing",
          "C) Skips to the next iteration",
          "D) Raises an exception"
        ],
        correct: "B",
        explanation: "The pass statement is a syntactical placeholder used when code is required but no action is needed."
      },
      {
        question: "Which method adds an element to the end of a Python List in O(1) time?",
        options: [
          "A) list.append(item)",
          "B) list.insert(0, item)",
          "C) list.extend()",
          "D) list.push(item)"
        ],
        correct: "A",
        explanation: "list.append(item) adds an item to the end of the list in amortized O(1) time."
      }
    ];

    const aiQuizPool = [
      {
        question: "What is the primary role of an Activation Function (e.g. ReLU, Sigmoid) in Neural Networks?",
        options: [
          "A) To speed up file saving",
          "B) To introduce non-linearity, allowing the model to learn complex patterns",
          "C) To set all weights to zero",
          "D) To reduce dataset size"
        ],
        correct: "B",
        explanation: "Without non-linear activation functions, a multi-layer neural network behaves like a single linear regression model."
      },
      {
        question: "Which algorithm updates neural network weights by calculating loss gradients backward?",
        options: [
          "A) Backpropagation with Gradient Descent",
          "B) Binary Search",
          "C) Breadth-First Search",
          "D) Random Search"
        ],
        correct: "A",
        explanation: "Backpropagation uses the chain rule to compute gradients of the loss function with respect to each weight."
      },
      {
        question: "What occurs when a model suffers from Overfitting?",
        options: [
          "A) It performs poorly on both training and test data",
          "B) It memorizes training data perfectly but fails to generalize to unseen test data",
          "C) It trains too quickly",
          "D) It runs out of RAM"
        ],
        correct: "B",
        explanation: "Overfitting happens when a high-capacity model fits noise in the training set rather than underlying rules."
      }
    ];

    const dsaQuizPool = [
      {
        question: "Which sorting algorithm guarantees O(N log N) time complexity in all cases (worst, average, best)?",
        options: [
          "A) QuickSort",
          "B) Merge Sort",
          "C) Bubble Sort",
          "D) Insertion Sort"
        ],
        correct: "B",
        explanation: "Merge Sort consistently divides arrays into halves and merges them in O(N log N) time regardless of initial order."
      },
      {
        question: "Which data structure is primarily used to implement Breadth-First Search (BFS) graph traversal?",
        options: [
          "A) Stack (LIFO)",
          "B) Queue (FIFO)",
          "C) Binary Heap",
          "D) Hash Table"
        ],
        correct: "B",
        explanation: "BFS explores nodes level by level using a First-In, First-Out (FIFO) Queue."
      },
      {
        question: "In a Binary Search Tree (BST), where are keys smaller than the root node stored?",
        options: [
          "A) In the right subtree",
          "B) In the left subtree",
          "C) At the leaf level only",
          "D) In a random position"
        ],
        correct: "B",
        explanation: "By BST definition, all nodes in the left subtree have values smaller than the root node."
      }
    ];

    const recursionQuizPool = [
      {
        question: "What is the primary role of a base case in a recursive function?",
        options: [
          "A) To make code run faster",
          "B) To stop execution and prevent Stack Overflow",
          "C) To initialize global variables",
          "D) To convert loops into functions"
        ],
        correct: "B",
        explanation: "The base case provides a non-recursive return path that unwinds the call stack and prevents memory overflow."
      },
      {
        question: "What error occurs in Python if a recursive function lacks a base case?",
        options: [
          "A) RecursionError: maximum recursion depth exceeded",
          "B) MemoryOverflowWarning",
          "C) NullPointerException",
          "D) ZeroDivisionError"
        ],
        correct: "A",
        explanation: "Python enforces a maximum recursion limit (1000 frames) to protect memory. Exceeding it raises a RecursionError."
      },
      {
        question: "What happens on the Call Stack every time a function calls itself?",
        options: [
          "A) The previous function frame is deleted immediately",
          "B) Heap memory is cleared",
          "C) A new stack frame containing local variables is pushed onto the stack",
          "D) No memory is consumed"
        ],
        correct: "C",
        explanation: "Each recursive invocation pushes a new Stack Frame onto the operating system call stack."
      },
      {
        question: "In calculating Factorial of 4 recursively (factorial(4)), how many total frames exist on the stack at the deepest point?",
        options: [
          "A) 1 frame",
          "B) 4 frames (or 5 including base case)",
          "C) 16 frames",
          "D) 0 frames"
        ],
        correct: "B",
        explanation: "factorial(4) calls factorial(3), which calls factorial(2), which calls factorial(1) — creating stacked frames."
      }
    ];

    const stackQuizPool = [
      {
        question: "Which principle governs how elements enter and leave a Stack data structure?",
        options: [
          "A) LIFO (Last-In, First-Out)",
          "B) FIFO (First-In, First-Out)",
          "C) Random Access Indexing",
          "D) Priority Key Queue"
        ],
        correct: "A",
        explanation: "Stacks operate on LIFO: the last element added is the first one removed."
      },
      {
        question: "What is the Time Complexity of push() and pop() operations in a Stack?",
        options: [
          "A) O(N) linear time",
          "B) O(1) constant time",
          "C) O(N log N)",
          "D) O(N^2)"
        ],
        correct: "B",
        explanation: "Both push() and pop() only interact with the top element of the stack, running in O(1) constant time."
      },
      {
        question: "Which real-world application relies directly on a Stack data structure?",
        options: [
          "A) Text editor Undo/Redo mechanism (Ctrl+Z)",
          "B) Printer document printing queue",
          "C) Database indexing",
          "D) CPU round-robin scheduling"
        ],
        correct: "A",
        explanation: "Text editors push actions onto a stack. Undo (Ctrl+Z) pops the most recent action off the top!"
      },
      {
        question: "What exception is raised if you attempt to pop() from an empty stack in Python?",
        options: [
          "A) IndexError: pop from empty list",
          "B) StackOverflowError",
          "C) KeyNotFoundException",
          "D) ZeroDivisionError"
        ],
        correct: "A",
        explanation: "Popping from an empty Python list raises an IndexError."
      }
    ];

    // Select Active Quiz Pool strictly matched to topic
    let activePool = recursionQuizPool;
    if (tLower.includes('matrix') || p.includes('matrix') || tLower.includes('linear algebra')) {
      activePool = matrixQuizPool;
    } else if (tLower.includes('python') || p.includes('python')) {
      activePool = pythonQuizPool;
    } else if (tLower.includes('ai') || tLower.includes('neural') || p.includes('ai') || tLower.includes('machine learning')) {
      activePool = aiQuizPool;
    } else if (tLower.includes('dsa') || tLower.includes('sort') || tLower.includes('search') || tLower.includes('tree') || tLower.includes('algorithm')) {
      activePool = dsaQuizPool;
    } else if (tLower.includes('stack') || p.includes('stack')) {
      activePool = stackQuizPool;
    }

    // Pick unasked question from pool to prevent repetition
    let unaskedQuestions = activePool.filter((q) => !askedQuestions.has(q.question));
    if (unaskedQuestions.length === 0) unaskedQuestions = activePool;
    const currentQ = unaskedQuestions[0] || activePool[0];

    let reply = '';

    // Handle user answering a quiz question (A, B, C, D)
    const isOptionChoice = /^[a-d]\)?$/i.test(p) || /^(option|choice|answer)\s*[a-d]$/i.test(p);
    if (isOptionChoice) {
      const userLetter = p.replace(/^(option|choice|answer)\s*/i, '').replace(/\)/g, '').toUpperCase();
      // Find matching question from pool
      const matchedQ = activePool.find((q) => askedQuestions.has(q.question)) || currentQ;

      if (userLetter === matchedQ.correct) {
        reply = `🎯 **Correct! Option ${matchedQ.correct} is the right answer!**\n\n${matchedQ.explanation}\n\n*Tap 'Quiz Me' below for the next check-in question on **${topic}**, or ask a follow-up!*`;
      } else {
        reply = `❌ **Not quite! You chose ${userLetter}, but the correct answer is ${matchedQ.correct}.**\n\n${matchedQ.explanation}\n\n*Tap 'Quiz Me' below to try another question on **${topic}**!*`;
      }
    } else if (action === 'quiz' || p.includes('quiz') || p.includes('next question') || p.includes('another question')) {
      reply = `📝 **Quick Check-In Question on ${topic}:**\n\n**${currentQ.question}**\n\n${currentQ.options.map((opt) => `- **${opt}**`).join('\n')}\n\n*Reply with your choice (A, B, C, or D) to check your answer!*`;
    } else if (action === 'simplify' || p.includes('simplify') || p.includes('simple') || p.includes('eli5') || p.includes('explain simpler')) {
      if (tLower.includes('stack') || p.includes('stack')) {
        reply = `🥞 **Stacks Explained Simply (ELI5)**\n\nImagine a stack of cafeteria plates or pancakes:\n\n• You can only add a plate to the **very top** (\`push\`).\n• You can only take a plate off the **very top** (\`pop\`).\n• The **last** plate placed on top is the **first** one removed (**LIFO**).\n\n*That's a Stack in a nutshell! Tap 'Quiz Me' below to check your understanding.*`;
      } else if (tLower.includes('recursion') || p.includes('recursion')) {
        reply = `🪆 **Recursion Explained Simply (ELI5)**\n\nThink of Russian nesting dolls:\n\n• To find the prize, you open doll after doll (**recursive step**).\n• When you reach the smallest solid doll that won't open, you stop (**base case**).\n• Then you close all dolls back up (**unwinding the call stack**).`;
      } else if (tLower.includes('matrix') || p.includes('matrix')) {
        reply = `📐 **Matrix Multiplication Explained Simply (ELI5)**\n\nImagine combining recipes:\n\n• You slide rows of Matrix A across columns of Matrix B to compute dot products.\n• It only works if the length of rows in A equals the height of columns in B!`;
      } else if (tLower.includes('python') || p.includes('python')) {
        reply = `🐍 **Python Data Structures Explained Simply**\n\n• **List:** An ordered toy box [1, 2, 3].\n• **Dict:** Labeled cubbies where you find items by name ('key': 'value').`;
      } else if (tLower.includes('ai') || tLower.includes('neural')) {
        reply = `🧠 **AI & Neural Networks Explained Simply (ELI5)**\n\nThink of a neural network like a group of friends making a decision together:\n\n• Each friend looks at a small clue and votes until the team gets the right answer!`;
      } else {
        reply = `💡 **${topic} Explained Simply (ELI5)**\n\nIn simple terms, **${topic}** is a fundamental building block in computer science that helps store and process data predictably and efficiently.`;
      }
    } else if (action === 'example' || p.includes('code example') || p.includes('show code')) {
      if (tLower.includes('stack') || p.includes('stack')) {
        reply = `🥞 **Python Stack Example**\n\n\`\`\`python\nstack = []\nstack.append("plate1")  # push\nstack.append("plate2")  # push\nprint(stack.pop())      # "plate2" (LIFO)\n\`\`\``;
      } else if (tLower.includes('recursion') || p.includes('recursion')) {
        reply = `🪆 **Python Recursion Example**\n\n\`\`\`python\ndef countdown(n):\n    if n <= 0:  # Base Case\n        print("Blastoff!")\n        return\n    print(n)\n    countdown(n - 1)  # Recursive Step\n\`\`\``;
      } else {
        reply = `💻 **Python Code Example for ${topic}**\n\n\`\`\`python\n# Practical code snippet for ${topic}\ndata = [1, 2, 3]\nprint("Processing:", data)\n\`\`\``;
      }
    } else if (action === 'visual' || p.includes('visual') || p.includes('diagram') || p.includes('ascii')) {
      if (tLower.includes('stack') || p.includes('stack')) {
        reply = `🥞 **Stack Visual ASCII Diagram**\n\n\`\`\`text\n  |  [ Plate 3 ]  |  <- TOP (Push / Pop here)\n  |  [ Plate 2 ]  |\n  |  [ Plate 1 ]  |  <- BOTTOM\n  +---------------+  (LIFO Order)\n\`\`\``;
      } else if (tLower.includes('recursion') || p.includes('recursion')) {
        reply = `🪆 **Recursion Call Stack Visual Diagram**\n\n\`\`\`text\n[ factorial(3) ] -> calls factorial(2)\n  [ factorial(2) ] -> calls factorial(1)\n    [ factorial(1) ] -> Base Case! Returns 1\n  Returns 2 * 1 = 2\nReturns 3 * 2 = 6\n\`\`\``;
      } else {
        reply = `📊 **Visual Diagram for ${topic}**\n\n\`\`\`text\nInput -> [ Process Layer ] -> Output\n\`\`\``;
      }
    } else if (p.includes('base case') || p.includes('basecase')) {
      reply = `🪆 **Base Cases in Recursion**\n\nA **base case** is the mandatory stopping condition in a recursive function that halts execution and unwinds the call stack.\n\nWithout a base case, a function calls itself indefinitely until it runs out of stack memory, triggering a **Stack Overflow** error (or \`RecursionError\` in Python).\n\n**Key Components:**\n• **Base Case:** Simple condition returning a value directly (e.g. \`if n <= 1: return 1\`).\n• **Recursive Step:** Calls the function with smaller inputs moving toward the base case (\`return n * factorial(n - 1)\`).\n\n\`\`\`python\ndef factorial(n):\n    if n <= 1:  # Base Case!\n        return 1\n    return n * factorial(n - 1)  # Recursive Step\n\`\`\`\n\n*Tap 'Quiz Me' below for a quick check-in question on Recursion!*`;
    } else if (p.includes('lifo')) {
      reply = `🥞 **LIFO — Last-In, First-Out**\n\n**LIFO** is the fundamental principle of a **Stack** data structure.\n\n• The **last** element added (pushed) to the stack is the **first** element removed (popped).\n• Think of a stack of cafeteria plates: you add plates to the top and take plates off the top.\n• **Time Complexity:** Push & Pop operations take **O(1)** constant time.\n\n*Would you like a Python code implementation or a quick quiz on Stacks?*`;
    } else if (p.includes('fifo')) {
      reply = `🎟️ **FIFO — First-In, First-Out**\n\n**FIFO** is the fundamental principle of a **Queue** data structure.\n\n• The **first** element added (enqueued) is the **first** element removed (dequeued).\n• Think of a line at a ticket counter or a print job queue: the first person in line gets served first!\n• **Contrast with Stack (LIFO):** Stacks remove the newest item, while queues remove the oldest item.`;
    } else if (/\bpush\b/i.test(p)) {
      reply = `🥞 **Stack operation: \`push(item)\`**\n\n• **Action:** Adds a new item to the **top** of the stack.\n• **Time Complexity:** **O(1)** constant time.\n• **Python Example:** \`stack.append(item)\`\n\n*Ask a follow-up or tap 'Quiz Me' for a quick check-in!*`;
    } else if (/\bpop\b/i.test(p)) {
      reply = `🥞 **Stack operation: \`pop()\`**\n\n• **Action:** Removes and returns the item currently at the **top** of the stack.\n• **Time Complexity:** **O(1)** constant time.\n• **Error Case:** Popping from an empty stack causes a **Stack Underflow** (\`IndexError\` in Python).\n• **Python Example:** \`top_item = stack.pop()\`\n\n*Ask a follow-up or tap 'Quiz Me' for a quick check-in!*`;
    } else if (p.includes('peek') || /\btop\b/i.test(p)) {
      reply = `🥞 **Stack operation: \`peek()\`**\n\n• **Action:** Inspects the item at the top of the stack **without** removing it.\n• **Time Complexity:** **O(1)** constant time.\n• **Python Example:** \`top_item = stack[-1]\`\n\n*Ask a follow-up or tap 'Quiz Me' for a quick check-in!*`;
    } else if (p.includes('queue') || p.includes('difference between stack and queue') || p.includes('stack vs queue')) {
      reply = `🥞 vs 🎟️ **Stack vs Queue Comparison**\n\n• **Stack (LIFO):** Last-In, First-Out. Add/Remove from the **top**. Examples: Undo button (Ctrl+Z), recursive call stack.\n• **Queue (FIFO):** First-In, First-Out. Add at **back** (enqueue), remove from **front** (dequeue). Examples: Printer queue, BFS graph search.`;
    } else if (p.includes('big o') || p.includes('time complexity') || p.includes('space complexity') || p.includes('complexity')) {
      reply = `⏱️ **Big O Notation & Complexity**\n\nBig O measures how algorithm performance scales as input size N grows:\n\n• **O(1) Constant:** Stack push/pop, array index lookup.\n• **O(log N) Logarithmic:** Binary Search.\n• **O(N) Linear:** Single loop over array.\n• **O(N log N) Linearithmic:** Merge Sort, QuickSort average.\n• **O(N²) Quadratic:** Nested loops, Bubble Sort.\n• **O(2ⁿ) Exponential:** Naive recursive Fibonacci.`;
    } else if (p.includes('recursion') || p.includes('recursive') || p.includes('call stack')) {
      reply = `🪆 **Recursion & Call Stack**\n\n**Recursion** is when a function calls itself to solve smaller instances of the same problem.\n\n• **Base Case:** Stopping condition (\`if n <= 1: return 1\`).\n• **Call Stack:** Each call pushes a new frame onto memory. When base case is hit, stack frames unwind back.\n\n*Tap 'Quiz Me' below for a check-in question on Recursion!*`;
    } else if (p.includes('matrix') || p.includes('dot product') || p.includes('determinant')) {
      if (isDetailedRequest) {
        reply = `📐 **Matrix Operations & Code**\n\n\`\`\`python\n# 2x2 Matrix Multiplication A x B\nA = [[1, 2], [3, 4]]\nB = [[5, 6], [7, 8]]\n\nC = [\n  [A[0][0]*B[0][0] + A[0][1]*B[1][0], A[0][0]*B[0][1] + A[0][1]*B[1][1]],\n  [A[1][0]*B[0][0] + A[1][1]*B[1][0], A[1][0]*B[0][1] + A[1][1]*B[1][1]]\n]\nprint(C) # [[19, 22], [43, 50]]\n\`\`\`\n\n• **Rule:** Columns of A must equal Rows of B.\n• **Time Complexity:** **O(N³)** standard.`;
      } else {
        reply = `📐 **Matrix Multiplication (Linear Algebra)**\n\nMatrix multiplication calculates dot products of rows of A and columns of B.\n\n• **Condition:** Columns of A ($n$) must equal Rows of B ($n$).\n• **Result Size:** A ($m \\times n$) $\\times$ B ($n \\times p$) = C ($m \\times p$).`;
      }
    } else if (p.includes('python') || p.includes('dictionary') || /\bdict\b/i.test(p) || /\blist\b/i.test(p)) {
      reply = `🐍 **Python Data Structures**\n\n• **List:** Ordered & Mutable array (\`append()\` is O(1)).\n• **Dict:** Key-Value Hash Table (\`O(1)\` lookup).\n• **Set:** Unordered Unique Collection (\`O(1)\` check).\n• **Tuple:** Immutable ordered array.`;
    } else if (/\b(ai|neural|deep learning)\b/i.test(p) || p.includes('activation function') || p.includes('backprop') || p.includes('overfitting')) {
      reply = `🧠 **Neural Networks & Deep Learning**\n\n• **Activation Function (ReLU/Sigmoid):** Adds non-linearity so neural nets can learn complex non-linear functions.\n• **Backpropagation:** Uses chain rule gradients to update weights.\n• **Overfitting:** Model memorizes training noise instead of general patterns.`;
    } else if (p.includes('sort') || p.includes('search') || p.includes('binary search') || p.includes('merge sort')) {
      reply = `📊 **Sorting & Searching**\n\n• **Binary Search:** O(log N) on sorted arrays.\n• **Merge Sort:** O(N log N) guaranteed divide-and-conquer.\n• **QuickSort:** O(N log N) average partitioning.`;
    } else if (p.includes('stack')) {
      if (isDetailedRequest) {
        reply = `🥞 **Python Stack Implementation & Details**\n\n\`\`\`python\nclass Stack:\n    def __init__(self):\n        self._items = []\n\n    def push(self, item):\n        self._items.append(item) # O(1)\n\n    def pop(self):\n        if not self._items:\n            raise IndexError("pop from empty stack")\n        return self._items.pop() # O(1)\n\`\`\`\n\n• **Push & Pop:** Both run in **O(1)** constant time.\n• **Use cases:** Undo button (Ctrl+Z), call stack in recursion.`;
      } else {
        reply = `🥞 **Stacks — Last-In, First-Out (LIFO)**\n\nA **Stack** is a data structure where the last item added is the first one removed — just like a stack of cafeteria plates!\n\n• **\`push(item)\`**: Add item to top (**O(1)**)\n• **\`pop()\`**: Remove item from top (**O(1)**)\n• **\`peek()\`**: Look at top item (**O(1)**)\n\n*Would you like a Python code example or a quick check-in quiz?*`;
      }
    } else if (p.length > 0 && !p.startsWith('hi') && !p.startsWith('hello') && !p.startsWith('hey')) {
      // Dynamic conversational fallback for ANY specific user prompt typed in chat!
      reply = `💡 **Regarding "${prompt}":**\n\nIn computer science and **${topic}**, this relates to core algorithmic concepts and system design.\n\n• **Core Concept:** Understanding how data or execution frames are stored and processed.\n• **In ${topic}:** Keep operations efficient (aiming for O(1) or O(log N) where possible) and account for base cases / boundary conditions.\n\n*Feel free to ask a follow-up, request a code example, or tap 'Quiz Me' below for a check-in question on ${topic}!*`;
    } else {
      // Generic workspace topic intro card (only when prompt is empty or just a greeting like "hi" / "hello")
      if (tLower.includes('matrix')) {
        reply = `📐 **Matrix Multiplication (Linear Algebra)**\n\nMatrix multiplication combines two matrices by taking dot products of rows from matrix A and columns from matrix B.\n\n• **Condition:** Columns of A must match Rows of B.\n• **Result Size:** A ($m \\times n$) $\\times$ B ($n \\times p$) = C ($m \\times p$).\n\n*Would you like a Python code example or a quick check-in quiz on Matrix math?*`;
      } else if (tLower.includes('python')) {
        reply = `🐍 **Python Programming Essentials**\n\nPython provides high-level data structures like Lists, Dictionaries, Sets, and Tuples.\n\n• **List:** Ordered & Mutable (**O(1)** append)\n• **Dict:** Key-Value Hash Table (**O(1)** lookup)\n• **Set:** Unordered Unique Collection\n\n*Tap 'Quiz Me' below for a quick check-in question on Python!*`;
      } else if (tLower.includes('stack')) {
        reply = `🥞 **Stacks — Last-In, First-Out (LIFO)**\n\nA **Stack** is a data structure where the last item added is the first one removed — just like a stack of cafeteria plates!\n\n• **\`push(item)\`**: Add item to top (**O(1)**)\n• **\`pop()\`**: Remove item from top (**O(1)**)\n• **\`peek()\`**: Look at top item (**O(1)**)\n\n*Would you like a Python code example or a quick check-in quiz?*`;
      } else if (tLower.includes('recursion')) {
        reply = `🪆 **Recursion & Base Cases**\n\n**Recursion** breaks problems down into identical sub-problems until a terminal **Base Case** stops execution.\n\n• **Base Case:** Stopping condition preventing infinite loops.\n• **Call Stack:** Each call pushes a new frame onto memory.\n\n*Tap 'Quiz Me' below for a quick check-in question on Recursion!*`;
      } else {
        reply = `👋 **Hey! I'm your LearnAI Tutor for ${topic}.**\n\nRegarding **${topic}** ${timestamp ? `(at ${timestamp})` : ''}:\n\n> "${prompt}"\n\n• **Core Idea:** Understanding core structures and algorithmic efficiency.\n• **Next Step:** Apply principles in practical code.\n\n*Tap 'Quiz Me' below for a quick check-in question on ${topic}!*`;
      }
    }

    return NextResponse.json({ success: true, reply, source: 'learnai_chatgpt_dynamic_quiz' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
