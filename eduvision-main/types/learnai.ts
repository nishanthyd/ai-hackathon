/**
 * LearnAI — Adaptive AI Learning Platform Type Definitions
 */

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Challenge';

export type LearningMode = 'learn' | 'practice' | 'revision' | 'exam' | 'project' | 'socratic';

export type PreferredStyle = 'Visual' | 'Examples' | 'Theory' | 'Hands-on' | 'Discussion';

export type LearningGoal =
  | 'College/exams'
  | 'Interview preparation'
  | 'Competitive programming'
  | 'Project building'
  | 'General understanding';

export type DailyTimeBudget = '10 minutes' | '20 minutes' | '30 minutes' | '1 hour' | '2+ hours';

export interface SubjectMastery {
  subject: string;
  percentage: number;
  strongTopics: string[];
  weakTopics: string[];
  lastStudiedDate: string;
}

export interface Mistake {
  id: string;
  topicId: string;
  topicName: string;
  concept: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  misconceptionType: string;
  occurrenceCount: number;
  lastDate: string;
  resolved: boolean;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  topic?: string;
  timestamp: string;
  date: string;
}

export interface LearnerProfile {
  name: string;
  avatar?: string;
  goal: LearningGoal;
  dailyTime: DailyTimeBudget;
  preferredStyle: PreferredStyle;
  currentLevel: DifficultyLevel;
  socraticMode: boolean;
  confidenceScore: number; // 0 - 100
  streakDays: number;
  todayMinutes: number;
  weeklyActivity: number[]; // 7 days of minutes
  subjects: Record<string, SubjectMastery>;
  recentMistakes: Mistake[];
  completedLessons: string[];
  searchHistory?: SearchHistoryItem[];
  visitedTopics?: string[];
  totalQuizzesAttempted?: number;
  totalQuestionsAnswered?: number;
  totalCorrectAnswers?: number;
  lastStruggledTopic?: {
    id: string;
    name: string;
    subtopic: string;
    attempts: number;
    reason: string;
    date: string;
  };
}

export interface EducationalVideo {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  duration: string;
  durationSeconds: number;
  difficulty: DifficultyLevel;
  educationScore: number; // 0 - 100
  topicMatchScore: number; // 0 - 100
  views: string;
  thumbnail: string;
  description: string;
  transcripts?: { timestamp: string; seconds: number; text: string }[];
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'true_false' | 'fill_blank' | 'code_output' | 'debugging';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  misconceptionAnalysis?: string;
  concept: string;
  difficulty: DifficultyLevel;
}

export interface PracticeProblem {
  id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: DifficultyLevel;
  description: string;
  starterCode?: string;
  hints: string[];
  sampleSolution: string;
  testCases?: { input: string; expectedOutput: string }[];
}

export interface KnowledgeNode {
  id: string;
  name: string;
  subject: string;
  parent?: string;
  status: 'mastered' | 'learning' | 'weak' | 'not_attempted';
  masteryPercentage: number;
  estimatedTimeMinutes: number;
  difficulty: DifficultyLevel;
  mistakeCount: number;
  recommendedVideoId?: string;
}

export interface SpacedRevisionItem {
  id: string;
  topicId: string;
  topicName: string;
  dueDate: string; // 'Today' | 'Tomorrow' | 'In 3 days'
  status: 'due' | 'upcoming' | 'completed';
  recallQuestion: string;
  sampleProblem: string;
}

export interface LearningSessionPlan {
  totalMinutes: number;
  breakdown: {
    videoMinutes: number;
    explanationMinutes: number;
    practiceMinutes: number;
    revisionMinutes: number;
  };
  recommendedTopic: string;
}
