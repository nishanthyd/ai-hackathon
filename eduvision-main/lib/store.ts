/**
 * LearnAI — Local Storage State & Adaptation Store
 */
import {
  LearnerProfile,
  KnowledgeNode,
  SpacedRevisionItem,
  Mistake,
  EducationalVideo,
  DifficultyLevel,
  LearningGoal,
  DailyTimeBudget,
  PreferredStyle,
} from '../types/learnai';
import {
  DEMO_LEARNER,
  DEMO_KNOWLEDGE_NODES,
  DEMO_SPACED_REVISIONS,
  DEMO_VIDEOS,
} from '../data/demoData';

export { DEMO_LEARNER };

const PROFILE_KEY = 'learnai_profile_v2';
const NODES_KEY = 'learnai_knowledge_nodes_v2';
const REVISIONS_KEY = 'learnai_spaced_revisions_v2';

export function getLearnerProfile(): LearnerProfile {
  if (typeof window === 'undefined') return DEMO_LEARNER;
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.error('Failed to parse LearnerProfile from localStorage:', err);
  }
  return DEMO_LEARNER;
}

export function saveLearnerProfile(profile: LearnerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save LearnerProfile:', err);
  }
}

export const BASE_AI_KNOWLEDGE_NODES: KnowledgeNode[] = [
  { id: 'kn-matrix', name: 'Linear Algebra & Tensors', subject: 'AI Mathematics', status: 'mastered', masteryPercentage: 85, estimatedTimeMinutes: 15, difficulty: 'Beginner', mistakeCount: 0, recommendedVideoId: 'vid-matrix-1' },
  { id: 'kn-matrix-mult', name: 'Matrix Multiplication & Dot Products', subject: 'AI Mathematics', parent: 'kn-matrix', status: 'learning', masteryPercentage: 65, estimatedTimeMinutes: 20, difficulty: 'Intermediate', mistakeCount: 1 },
  { id: 'kn-neural', name: 'Neural Network Architectures', subject: 'Neural Networks', parent: 'kn-matrix-mult', status: 'learning', masteryPercentage: 72, estimatedTimeMinutes: 25, difficulty: 'Intermediate', mistakeCount: 1 },
  { id: 'kn-activations', name: 'ReLU & Sigmoid Activation Functions', subject: 'Neural Networks', parent: 'kn-neural', status: 'weak', masteryPercentage: 35, estimatedTimeMinutes: 15, difficulty: 'Intermediate', mistakeCount: 3 },
  { id: 'kn-grad-descent', name: 'Gradient Descent & Cost Optimization', subject: 'Optimization', parent: 'kn-neural', status: 'learning', masteryPercentage: 60, estimatedTimeMinutes: 30, difficulty: 'Advanced', mistakeCount: 2 },
  { id: 'kn-py-funcs', name: 'Python Functions & Scope', subject: 'Python for AI', status: 'mastered', masteryPercentage: 92, estimatedTimeMinutes: 10, difficulty: 'Beginner', mistakeCount: 0 },
  { id: 'kn-rec', name: 'Recursion & Call Stack Tracing', subject: 'Python for AI', parent: 'kn-py-funcs', status: 'weak', masteryPercentage: 28, estimatedTimeMinutes: 25, difficulty: 'Intermediate', mistakeCount: 4, recommendedVideoId: 'vid-recursion-1' },
  { id: 'kn-stacks', name: 'Stacks & LIFO Memory Structures', subject: 'Data Structures', parent: 'kn-py-funcs', status: 'mastered', masteryPercentage: 88, estimatedTimeMinutes: 15, difficulty: 'Beginner', mistakeCount: 0 },
];

export function getKnowledgeNodes(): KnowledgeNode[] {
  if (typeof window === 'undefined') return BASE_AI_KNOWLEDGE_NODES;

  try {
    const profile = getLearnerProfile();
    const practiceHistory = getPracticeHistory();
    const saved = localStorage.getItem(NODES_KEY);
    let nodes: KnowledgeNode[] = saved ? JSON.parse(saved) : BASE_AI_KNOWLEDGE_NODES;

    // Dynamically update nodes based on REAL learner telemetry
    return nodes.map((node) => {
      const updated = { ...node };

      // 1. Check recent mistakes for node matches
      const matchingMistakes = (profile.recentMistakes || []).filter((m) =>
        m.topicName.toLowerCase().includes(node.name.toLowerCase()) ||
        node.name.toLowerCase().includes(m.topicName.toLowerCase()) ||
        m.concept.toLowerCase().includes(node.name.toLowerCase())
      );

      if (matchingMistakes.length > 0) {
        updated.mistakeCount = matchingMistakes.reduce((acc, curr) => acc + (curr.occurrenceCount || 1), 0);
        if (updated.mistakeCount >= 2) {
          updated.status = 'weak';
          updated.masteryPercentage = Math.max(15, 50 - updated.mistakeCount * 8);
        }
      }

      // 2. Check if this is the last struggled topic
      if (profile.lastStruggledTopic && profile.lastStruggledTopic.name.toLowerCase().includes(node.name.toLowerCase())) {
        updated.status = 'weak';
        updated.masteryPercentage = Math.min(updated.masteryPercentage, 30);
        updated.mistakeCount = Math.max(updated.mistakeCount, profile.lastStruggledTopic.attempts || 3);
      }

      // 3. Check practice history (VS Code IDE runs)
      const practiceEntries = Object.values(practiceHistory);
      const matchingPractice = practiceEntries.find((p) =>
        p.problemId.toLowerCase().includes(node.name.toLowerCase()) ||
        node.name.toLowerCase().includes(p.problemId.toLowerCase())
      );

      if (matchingPractice) {
        if (matchingPractice.status === 'Solved') {
          updated.status = 'mastered';
          updated.masteryPercentage = Math.max(updated.masteryPercentage, 90);
          updated.mistakeCount = 0;
        } else if (matchingPractice.status === 'Needs Practice') {
          updated.status = 'weak';
          updated.masteryPercentage = Math.min(updated.masteryPercentage, 40);
          updated.mistakeCount += matchingPractice.runCount;
        }
      }

      // 4. Check subject mastery object in profile
      const subjKey = Object.keys(profile.subjects || {}).find(
        (s) => s.toLowerCase() === node.subject.toLowerCase()
      );
      if (subjKey && profile.subjects[subjKey]) {
        const subj = profile.subjects[subjKey];
        if (subj.strongTopics.some((t) => t.toLowerCase().includes(node.name.toLowerCase()))) {
          updated.status = 'mastered';
          updated.masteryPercentage = Math.max(updated.masteryPercentage, 85);
        } else if (subj.weakTopics.some((t) => t.toLowerCase().includes(node.name.toLowerCase()))) {
          updated.status = 'weak';
          updated.masteryPercentage = Math.min(updated.masteryPercentage, 35);
        }
      }

      return updated;
    });
  } catch (err) {
    console.error('Failed to compute dynamic KnowledgeNodes:', err);
    return BASE_AI_KNOWLEDGE_NODES;
  }
}

export function saveKnowledgeNodes(nodes: KnowledgeNode[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NODES_KEY, JSON.stringify(nodes));
  } catch (err) {
    console.error('Failed to save KnowledgeNodes:', err);
  }
}

export function getSpacedRevisions(): SpacedRevisionItem[] {
  if (typeof window === 'undefined') return DEMO_SPACED_REVISIONS;
  try {
    const data = localStorage.getItem(REVISIONS_KEY);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.error('Failed to parse SpacedRevisions:', err);
  }
  return DEMO_SPACED_REVISIONS;
}

export function saveSpacedRevisions(revisions: SpacedRevisionItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REVISIONS_KEY, JSON.stringify(revisions));
  } catch (err) {
    console.error('Failed to save SpacedRevisions:', err);
  }
}

/**
 * Adaptive Difficulty Engine:
 * - Accuracy >= 80%: Increase difficulty level, update knowledge node to 'mastered'.
 * - Accuracy < 50%: Decrease difficulty level, log mistake, update knowledge node to 'weak'.
 */
export function processQuizResult(
  topicId: string,
  topicName: string,
  subject: string,
  score: number,
  total: number,
  confidenceRating: number // 1 to 5 scale
): {
  profile: LearnerProfile;
  feedbackMessage: string;
  confidenceComparison: string;
  levelChanged: boolean;
} {
  const profile = getLearnerProfile();
  const accuracyPct = Math.round((score / total) * 100);
  const confidencePct = Math.round((confidenceRating / 5) * 100);

  // Confidence Calibration
  let confidenceComparison = '';
  if (confidencePct > accuracyPct + 25) {
    confidenceComparison = '⚠️ Your confidence rating (90%) was higher than your demonstrated accuracy. Review the key concepts below.';
  } else if (accuracyPct > confidencePct + 25) {
    confidenceComparison = "✨ Great job! You are performing better than you think (demonstrated accuracy higher than your confidence rating).";
  } else {
    confidenceComparison = '🎯 Excellent self-awareness! Your confidence rating matched your actual accuracy closely.';
  }

  let levelChanged = false;
  let feedbackMessage = '';

  let subjectEntry = profile.subjects[subject];
  if (!subjectEntry) {
    subjectEntry = {
      subject,
      percentage: 50,
      strongTopics: [],
      weakTopics: [],
      lastStudiedDate: 'Today',
    };
    profile.subjects[subject] = subjectEntry;
  }

  if (accuracyPct >= 80) {
    subjectEntry.percentage = Math.min(100, subjectEntry.percentage + 6);
    if (!subjectEntry.strongTopics.includes(topicName)) {
      subjectEntry.strongTopics.push(topicName);
    }
    subjectEntry.weakTopics = subjectEntry.weakTopics.filter((t) => t !== topicName);

    if (profile.currentLevel === 'Beginner') {
      profile.currentLevel = 'Intermediate';
      levelChanged = true;
    } else if (profile.currentLevel === 'Intermediate' && subjectEntry.percentage > 85) {
      profile.currentLevel = 'Advanced';
      levelChanged = true;
    }
    feedbackMessage = `Mastery increased to ${subjectEntry.percentage}%! Difficulty level set to ${profile.currentLevel}.`;
  } else if (accuracyPct < 50) {
    subjectEntry.percentage = Math.max(10, subjectEntry.percentage - 8);
    if (!subjectEntry.weakTopics.includes(topicName)) {
      subjectEntry.weakTopics.push(topicName);
    }
    subjectEntry.strongTopics = subjectEntry.strongTopics.filter((t) => t !== topicName);

    profile.lastStruggledTopic = {
      id: topicId,
      name: topicName,
      subtopic: 'Base Cases & Termination Conditions',
      attempts: (profile.lastStruggledTopic?.attempts || 0) + 1,
      reason: `Struggled with ${topicName} questions (${accuracyPct}% accuracy).`,
      date: 'Today',
    };

    if (profile.currentLevel === 'Advanced') {
      profile.currentLevel = 'Intermediate';
      levelChanged = true;
    } else if (profile.currentLevel === 'Intermediate' && subjectEntry.percentage < 45) {
      profile.currentLevel = 'Beginner';
      levelChanged = true;
    }
    feedbackMessage = `We detected difficulty with ${topicName}. Recommended mini lesson on base cases & visual call stack.`;
  } else {
    feedbackMessage = `Good effort! Topic mastery steady at ${subjectEntry.percentage}%.`;
  }

  // Update Knowledge Nodes
  const nodes = getKnowledgeNodes();
  const targetNode = nodes.find((n) => n.name.toLowerCase() === topicName.toLowerCase() || n.id === topicId);
  if (targetNode) {
    targetNode.masteryPercentage = Math.round((targetNode.masteryPercentage + accuracyPct) / 2);
    targetNode.status = accuracyPct >= 80 ? 'mastered' : accuracyPct < 50 ? 'weak' : 'learning';
    saveKnowledgeNodes(nodes);
  }

  saveLearnerProfile(profile);

  return { profile, feedbackMessage, confidenceComparison, levelChanged };
}

/**
 * Explain-Back Evaluator ("Teach it back to me"):
 * Evaluates student text response for key concepts (e.g. base case, call stack, unwinding).
 */
export function evaluateExplainBack(
  topic: string,
  userExplanation: string
): {
  understandingPct: number;
  missingConcepts: string[];
  feedback: string;
  misconceptions: string[];
} {
  const text = userExplanation.toLowerCase();
  const missingConcepts: string[] = [];
  const misconceptions: string[] = [];

  let score = 40;

  if (text.includes('base case') || text.includes('stop') || text.includes('terminat')) {
    score += 30;
  } else {
    missingConcepts.push('Base Case / Termination Condition');
  }

  if (text.includes('call stack') || text.includes('frame') || text.includes('stack')) {
    score += 20;
  } else {
    missingConcepts.push('Call Stack Frame Push/Pop');
  }

  if (text.includes('unwind') || text.includes('return value') || text.includes('backtracking')) {
    score += 10;
  } else {
    missingConcepts.push('Return Value Unwinding');
  }

  if (!text.includes('base') && text.length > 20) {
    misconceptions.push('Risk of Infinite Recursion (Stack Overflow)');
  }

  let feedback = '';
  if (score >= 80) {
    feedback = `🌟 Excellent explanation of ${topic}! You clearly articulated termination conditions and stack unwinding.`;
  } else {
    feedback = `Good attempt at explaining ${topic}! To reach 100% conceptual mastery, make sure to include: ${missingConcepts.join(', ')}.`;
  }

  return {
    understandingPct: Math.min(100, score),
    missingConcepts,
    feedback,
    misconceptions,
  };
}

/**
 * Record a mistake in the Mistake Bank
 */
export function recordMistake(
  topicId: string,
  topicName: string,
  concept: string,
  question: string,
  userAnswer: string,
  correctAnswer: string,
  explanation: string
): void {
  const profile = getLearnerProfile();
  const existing = profile.recentMistakes.find((m) => m.question === question);
  if (existing) {
    existing.occurrenceCount++;
    existing.lastDate = 'Today';
  } else {
    profile.recentMistakes.unshift({
      id: `m_${Date.now()}`,
      topicId,
      topicName,
      concept,
      question,
      userAnswer,
      correctAnswer,
      explanation,
      misconceptionType: concept,
      occurrenceCount: 1,
      lastDate: 'Today',
      resolved: false,
    });
  }
  saveLearnerProfile(profile);
}

/**
 * Resolve/Remove a mistake from recentMistakes
 */
export function resolveMistake(mistakeId: string): LearnerProfile {
  const profile = getLearnerProfile();
  if (profile.recentMistakes) {
    profile.recentMistakes = profile.recentMistakes.filter((m) => m.id !== mistakeId);
    saveLearnerProfile(profile);
  }
  return profile;
}

/**
 * Record a search query in Search History
 */
export function recordSearchQuery(query: string, topic?: string): void {
  if (!query || !query.trim()) return;
  const profile = getLearnerProfile();
  if (!profile.searchHistory) profile.searchHistory = [];

  const trimmed = query.trim();
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Prevent duplicate consecutive search entries
  if (profile.searchHistory.length > 0 && profile.searchHistory[0].query.toLowerCase() === trimmed.toLowerCase()) {
    return;
  }

  profile.searchHistory.unshift({
    id: `s_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    query: trimmed,
    topic: topic || trimmed,
    timestamp: timeStr,
    date: 'Today',
  });

  if (profile.searchHistory.length > 25) {
    profile.searchHistory = profile.searchHistory.slice(0, 25);
  }

  saveLearnerProfile(profile);
}

/**
 * Record a visited topic
 */
export function recordTopicVisit(topicName: string): void {
  if (!topicName || !topicName.trim()) return;
  const profile = getLearnerProfile();
  if (!profile.visitedTopics) profile.visitedTopics = [];

  if (!profile.visitedTopics.includes(topicName)) {
    profile.visitedTopics.push(topicName);
  }

  if (!profile.completedLessons.includes(topicName)) {
    profile.completedLessons.push(topicName);
  }

  saveLearnerProfile(profile);
}

/**
 * Record quiz attempt statistics
 */
export function recordQuizAttempt(score: number, total: number): void {
  const profile = getLearnerProfile();
  profile.totalQuizzesAttempted = (profile.totalQuizzesAttempted || 0) + 1;
  profile.totalQuestionsAnswered = (profile.totalQuestionsAnswered || 0) + total;
  profile.totalCorrectAnswers = (profile.totalCorrectAnswers || 0) + score;
  saveLearnerProfile(profile);
}

const PRACTICE_KEY = 'learnai_practice_history_v1';

export interface PracticeHistoryEntry {
  problemId: string;
  runCount: number;
  status: 'Solved' | 'Needs Practice' | 'Not Attempted';
  userCode: string;
  lastError?: string;
  lastRunDate: string;
}

export function getPracticeHistory(): Record<string, PracticeHistoryEntry> {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(PRACTICE_KEY);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.error('Failed to parse PracticeHistory:', err);
  }
  return {};
}

export function recordPracticeExecution(
  problemId: string,
  problemTitle: string,
  isSuccess: boolean,
  code: string,
  errorMsg?: string
): PracticeHistoryEntry {
  const history = getPracticeHistory();
  const existing = history[problemId] || {
    problemId,
    runCount: 0,
    status: 'Not Attempted',
    userCode: code,
    lastRunDate: 'Today',
  };

  existing.runCount += 1;
  existing.userCode = code;
  existing.lastRunDate = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isSuccess) {
    existing.status = 'Solved';
    delete existing.lastError;
  } else {
    existing.status = 'Needs Practice';
    existing.lastError = errorMsg || 'Test case verification failed.';
    recordMistake(
      problemId,
      problemTitle,
      'Code Logic / Test Case Error',
      `Coding Challenge: ${problemTitle}`,
      code,
      'Expected code to pass all test cases',
      errorMsg || 'Code produced unexpected outputs or raised runtime errors.'
    );
  }

  history[problemId] = existing;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PRACTICE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save PracticeHistory:', e);
    }
  }

  return existing;
}
