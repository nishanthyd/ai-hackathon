/**
 * learningProfileStore.ts
 * Manages personalized student learning profiles, skill mastery, weak/strong topics,
 * learning preferences, and adaptive difficulty level calculation.
 */

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type LearningMode = 'videos' | 'manim' | 'both';

export interface SubjectMastery {
  subject: string;
  percentage: number;
  strongTopics: string[];
  weakTopics: string[];
}

export interface StudentProfile {
  name: string;
  currentLevel: DifficultyLevel;
  preferredMode: LearningMode;
  learningSpeed: string;
  confidence: number; // 0 - 100
  subjects: Record<string, SubjectMastery>;
  recentMistakes: { topic: string; question: string; date: string }[];
  history: { topic: string; mode: LearningMode; difficulty: DifficultyLevel; score: number; date: string }[];
  lastStruggledTopic?: { topic: string; subtopic: string; date: string };
}

const DEFAULT_PROFILE: StudentProfile = {
  name: 'Nishanth',
  currentLevel: 'Intermediate',
  preferredMode: 'both',
  learningSpeed: 'Moderate',
  confidence: 78,
  subjects: {
    Python: {
      subject: 'Python',
      percentage: 78,
      strongTopics: ['Loops', 'Functions', 'Conditionals'],
      weakTopics: ['Recursion', 'Dynamic Programming'],
    },
    Mathematics: {
      subject: 'Mathematics',
      percentage: 84,
      strongTopics: ['Derivatives', 'Linear Equations'],
      weakTopics: ['Integrals', 'Matrix Multiplication'],
    },
    Biology: {
      subject: 'Biology',
      percentage: 65,
      strongTopics: ['Cell Structure', 'Respiration'],
      weakTopics: ['Krebs Cycle', 'Photosynthesis Light Reaction'],
    },
  },
  recentMistakes: [
    { topic: 'Recursion', question: 'What is the base case in a recursive function?', date: 'Yesterday' },
    { topic: 'Recursion', question: 'Explain stack overflow in recursive calls.', date: 'Yesterday' },
  ],
  history: [
    { topic: 'Merge Sort', mode: 'both', difficulty: 'Intermediate', score: 85, date: '2 days ago' },
    { topic: 'Recursion', mode: 'manim', difficulty: 'Intermediate', score: 40, date: 'Yesterday' },
  ],
  lastStruggledTopic: {
    topic: 'Recursion',
    subtopic: 'Base Cases & Call Stack',
    date: 'Yesterday',
  },
};

const STORAGE_KEY = 'eduvision_student_profile_v1';

export function getStudentProfile(): StudentProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Failed to read student profile from localStorage:', err);
  }
  return DEFAULT_PROFILE;
}

export function saveStudentProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save student profile to localStorage:', err);
  }
}

/**
 * Adaptive Engine Algorithm:
 * - Score >= 80%: Boost mastery %, mark topic as Strong, potentially level up difficulty.
 * - Score < 50%: Reduce mastery %, mark topic as Weak, set as lastStruggledTopic, level down if repeated.
 */
export function updateProfileAfterQuiz(
  topicName: string,
  subjectName: string = 'Python',
  score: number,
  total: number
): StudentProfile {
  const profile = getStudentProfile();
  const percentage = Math.round((score / total) * 100);
  const dateStr = new Date().toLocaleDateString();

  let subject = profile.subjects[subjectName];
  if (!subject) {
    subject = {
      subject: subjectName,
      percentage: 50,
      strongTopics: [],
      weakTopics: [],
    };
    profile.subjects[subjectName] = subject;
  }

  if (percentage >= 80) {
    // Student performed well -> Level Up & mark strong
    subject.percentage = Math.min(100, subject.percentage + 5);
    if (!subject.strongTopics.includes(topicName)) {
      subject.strongTopics.push(topicName);
    }
    subject.weakTopics = subject.weakTopics.filter((t) => t !== topicName);

    if (profile.currentLevel === 'Beginner') {
      profile.currentLevel = 'Intermediate';
    } else if (profile.currentLevel === 'Intermediate' && subject.percentage > 85) {
      profile.currentLevel = 'Advanced';
    }
  } else if (percentage < 50) {
    // Student struggled -> Level Down & mark weak
    subject.percentage = Math.max(10, subject.percentage - 8);
    if (!subject.weakTopics.includes(topicName)) {
      subject.weakTopics.push(topicName);
    }
    subject.strongTopics = subject.strongTopics.filter((t) => t !== topicName);
    profile.lastStruggledTopic = {
      topic: topicName,
      subtopic: 'Review concept and interactive practice',
      date: dateStr,
    };

    if (profile.currentLevel === 'Advanced') {
      profile.currentLevel = 'Intermediate';
    } else if (profile.currentLevel === 'Intermediate' && subject.percentage < 45) {
      profile.currentLevel = 'Beginner';
    }
  }

  profile.history.unshift({
    topic: topicName,
    mode: profile.preferredMode,
    difficulty: profile.currentLevel,
    score: percentage,
    date: dateStr,
  });

  saveStudentProfile(profile);
  return profile;
}
