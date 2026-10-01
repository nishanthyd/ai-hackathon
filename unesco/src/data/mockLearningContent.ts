export interface LearningTopic {
  id: string
  subject: 'math' | 'science' | 'social' | 'language' | 'arts'
  grade: number
  title: string
  overview: string
  keyPoints: string[]
  quiz: { question: string; answer: string }[]
}

export const mockLearningContent: LearningTopic[] = [
  {
    id: 'fractions-3',
    subject: 'math',
    grade: 3,
    title: 'Building Fractions with Everyday Objects',
    overview: 'A hands-on introduction to fractions using food, shapes, and classroom examples.',
    keyPoints: ['Numerator and denominator explained', 'Comparing equal parts', 'Visual fraction models'],
    quiz: [
      { question: 'What does the numerator represent?', answer: 'The number of parts we have.' },
      { question: 'Is 1/2 larger or smaller than 1/4?', answer: 'Larger.' }
    ]
  },
  {
    id: 'ecosystems-5',
    subject: 'science',
    grade: 5,
    title: 'Ecosystems, Food Chains, and Habitat Balance',
    overview: 'Explore how plants, animals, and environments depend on each other in a living ecosystem.',
    keyPoints: ['Producers, consumers, and decomposers', 'Food chain flow', 'Habitat preservation'],
    quiz: [
      { question: 'What role do producers play?', answer: 'They make food from sunlight.' },
      { question: 'Why are pollinators important?', answer: 'They help plants reproduce.' }
    ]
  },
  {
    id: 'citizenship-6',
    subject: 'social',
    grade: 6,
    title: 'Digital Citizenship and Civil Responsibility',
    overview: 'Learn how students can participate responsibly online and in their communities.',
    keyPoints: ['Community values', 'Rights and responsibilities', 'Safe information sharing'],
    quiz: [
      { question: 'What is civic responsibility?', answer: 'Actions that support the community.' },
      { question: 'How do you verify online information?', answer: 'Check trusted sources and compare evidence.' }
    ]
  },
  {
    id: 'grammar-4',
    subject: 'language',
    grade: 4,
    title: 'Creating Clear Sentences with Grammar Tools',
    overview: 'Practice sentence structure, descriptive language, and paragraph flow for confident writing.',
    keyPoints: ['Subject and predicate', 'Using vivid adjectives', 'Sentence variety'],
    quiz: [
      { question: 'What is a predicate?', answer: 'The action or description in a sentence.' },
      { question: 'Why use adjectives?', answer: 'To make writing more vivid.' }
    ]
  },
  {
    id: 'moving-art-7',
    subject: 'arts',
    grade: 7,
    title: 'Storytelling through Motion and Visual Rhythm',
    overview: 'Design animations and story beats that communicate emotion through movement.',
    keyPoints: ['Visual storytelling basics', 'Rhythm and pacing', 'Simple animation planning'],
    quiz: [
      { question: 'What does rhythm do in a story?', answer: 'It controls pacing and flow.' },
      { question: 'What is a storyboard?', answer: 'A sequence of visual scenes for planning.' }
    ]
  },
  {
    id: 'fractions-7',
    subject: 'math',
    grade: 7,
    title: 'From Ratios to Rational Numbers',
    overview: 'Deepen fraction skills and connect them to ratios, decimals, and real-world examples.',
    keyPoints: ['Equivalent fractions', 'Ratio language', 'Fraction word problems'],
    quiz: [
      { question: 'What is an equivalent fraction?', answer: 'A different fraction with the same value.' },
      { question: 'How can a fraction become a decimal?', answer: 'Divide numerator by denominator.' }
    ]
  },
  {
    id: 'atoms-9',
    subject: 'science',
    grade: 9,
    title: 'Atoms, Elements, and the Periodic Table',
    overview: 'A structured map of the building blocks of matter and how modern scientists use them.',
    keyPoints: ['Atomic structure', 'Periodic trends', 'Chemical symbols'],
    quiz: [
      { question: 'What are protons?', answer: 'Positively charged particles in the nucleus.' },
      { question: 'What does the periodic table organize?', answer: 'Elements by properties.' }
    ]
  },
  {
    id: 'world-history-10',
    subject: 'social',
    grade: 10,
    title: 'Global Movements and Modern Societies',
    overview: 'Study key global events and how they shaped modern civic identity and cultural exchange.',
    keyPoints: ['Era of change', 'Citizen voices', 'Cultural exchange'],
    quiz: [
      { question: 'Why do movements spread globally?', answer: 'Ideas connect communities across boundaries.' },
      { question: 'What is cultural exchange?', answer: 'Sharing traditions and knowledge between societies.' }
    ]
  },
  {
    id: 'essay-12',
    subject: 'language',
    grade: 12,
    title: 'Writing Persuasive Essays with Evidence and Voice',
    overview: 'Compose persuasive writing that uses evidence, structure, and a confident authorial voice.',
    keyPoints: ['Thesis development', 'Supporting evidence', 'Tone and revision'],
    quiz: [
      { question: 'What strengthens an argument?', answer: 'Clear evidence and reasoning.' },
      { question: 'What is revision for?', answer: 'To improve clarity and flow.' }
    ]
  }
]
