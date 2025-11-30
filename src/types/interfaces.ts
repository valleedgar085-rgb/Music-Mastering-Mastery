import { SkillCategory, DifficultyLevel, ContentType, ProgressStatus } from './enums';

/**
 * Represents a user's skill rating in a specific category
 */
export interface SkillRating {
  category: SkillCategory;
  rating: number; // 1-5 scale
  lastAssessed: Date;
  history: SkillRatingHistory[];
}

/**
 * Historical record of skill rating changes
 */
export interface SkillRatingHistory {
  rating: number;
  assessedAt: Date;
  source: string; // e.g., 'initial_test', 'quiz', 'minigame'
}

/**
 * User profile with skill assessments and learning progress
 */
export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  lastActiveAt: Date;
  hasCompletedInitialAssessment: boolean;
  skillRatings: SkillRating[];
  currentLearningPlanId?: string;
}

/**
 * A single question in the assessment
 */
export interface AssessmentQuestion {
  id: string;
  category: SkillCategory;
  questionType: string;
  difficulty: DifficultyLevel;
  prompt: string;
  audioUrl?: string;
  options?: QuestionOption[];
  correctAnswer: string | string[];
  points: number;
  timeLimit?: number; // in seconds
  metadata?: Record<string, unknown>;
}

/**
 * Option for multiple choice questions
 */
export interface QuestionOption {
  id: string;
  text: string;
  audioUrl?: string;
}

/**
 * User's answer to an assessment question
 */
export interface UserAnswer {
  questionId: string;
  answer: string | string[];
  timeTaken: number; // in seconds
  isCorrect: boolean;
  pointsEarned: number;
}

/**
 * Results from a completed assessment section
 */
export interface SectionResult {
  category: SkillCategory;
  totalQuestions: number;
  correctAnswers: number;
  totalPoints: number;
  earnedPoints: number;
  percentageScore: number;
  calculatedRating: number; // 1-5 scale
  answers: UserAnswer[];
}

/**
 * Complete assessment result for a user
 */
export interface AssessmentResult {
  id: string;
  userId: string;
  startedAt: Date;
  completedAt: Date;
  sections: SectionResult[];
  overallScore: number;
  recommendations: string[];
}

/**
 * A learning content item (lesson, minigame, quiz)
 */
export interface LearningContent {
  id: string;
  title: string;
  description: string;
  category: SkillCategory;
  contentType: ContentType;
  difficulty: DifficultyLevel;
  estimatedDuration: number; // in minutes
  prerequisites?: string[]; // content IDs
  objectives: string[];
  contentData: Record<string, unknown>;
}

/**
 * An item in the user's learning plan
 */
export interface LearningPlanItem {
  id: string;
  contentId: string;
  order: number;
  status: ProgressStatus;
  startedAt?: Date;
  completedAt?: Date;
  score?: number;
  attempts: number;
}

/**
 * Adaptive learning plan generated for a user
 */
export interface LearningPlan {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  items: LearningPlanItem[];
  focusAreas: SkillCategory[];
  currentItemIndex: number;
  isActive: boolean;
}

/**
 * Dashboard data for user view
 */
export interface UserDashboard {
  user: User;
  skillRatings: Array<{
    category: SkillCategory;
    categoryName: string;
    rating: number;
    maxRating: number;
    trend: 'improving' | 'stable' | 'declining';
  }>;
  currentPlan?: {
    id: string;
    progress: number;
    currentItem?: LearningContent;
    nextItems: LearningContent[];
  };
  recentActivity: Array<{
    date: Date;
    activity: string;
    score?: number;
  }>;
  recommendations: string[];
}
