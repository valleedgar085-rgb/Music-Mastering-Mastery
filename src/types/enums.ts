/**
 * Skill categories for music mastering assessment
 */
export enum SkillCategory {
  FREQUENCY_FINDER = 'FREQUENCY_FINDER',
  EQ_SKILL = 'EQ_SKILL',
  BALANCING = 'BALANCING',
  COMPRESSION = 'COMPRESSION',
  SONG_STRUCTURE = 'SONG_STRUCTURE'
}

/**
 * Question types for the assessment
 */
export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  AUDIO_IDENTIFICATION = 'AUDIO_IDENTIFICATION',
  INTERACTIVE_MINIGAME = 'INTERACTIVE_MINIGAME',
  SLIDER_MATCH = 'SLIDER_MATCH',
  ORDERING = 'ORDERING'
}

/**
 * Difficulty levels for content
 */
export enum DifficultyLevel {
  BEGINNER = 1,
  INTERMEDIATE = 2,
  ADVANCED = 3,
  EXPERT = 4,
  MASTER = 5
}

/**
 * Content types for learning plan
 */
export enum ContentType {
  LESSON = 'LESSON',
  MINI_GAME = 'MINI_GAME',
  QUIZ = 'QUIZ',
  PRACTICE = 'PRACTICE'
}

/**
 * Progress status for learning items
 */
export enum ProgressStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  MASTERED = 'MASTERED'
}
