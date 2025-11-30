import { LearningContent, SkillCategory, ContentType, DifficultyLevel } from '../types';

/**
 * Learning content library with lessons, mini-games, and quizzes
 * organized by skill category and difficulty level
 */
export const learningContentLibrary: LearningContent[] = [
  // ==================== FREQUENCY FINDER CONTENT ====================
  // Lessons
  {
    id: 'freq-lesson-basics',
    title: 'Introduction to Audio Frequencies',
    description: 'Learn the fundamentals of audio frequency spectrum and how different frequencies affect sound.',
    category: SkillCategory.FREQUENCY_FINDER,
    contentType: ContentType.LESSON,
    difficulty: DifficultyLevel.BEGINNER,
    estimatedDuration: 15,
    objectives: [
      'Understand the audio frequency spectrum (20Hz - 20kHz)',
      'Identify major frequency bands and their characteristics',
      'Learn common frequency descriptors used in mixing'
    ],
    contentData: {
      sections: [
        { title: 'What is Frequency?', type: 'text' },
        { title: 'The Frequency Spectrum', type: 'interactive' },
        { title: 'Frequency Bands Explained', type: 'audio_example' }
      ]
    }
  },
  {
    id: 'freq-lesson-problem-areas',
    title: 'Identifying Problem Frequencies',
    description: 'Learn to identify and fix common frequency problems like muddiness, harshness, and boxiness.',
    category: SkillCategory.FREQUENCY_FINDER,
    contentType: ContentType.LESSON,
    difficulty: DifficultyLevel.INTERMEDIATE,
    estimatedDuration: 20,
    prerequisites: ['freq-lesson-basics'],
    objectives: [
      'Recognize common frequency problems in mixes',
      'Learn sweep techniques to find problem frequencies',
      'Apply corrective EQ to solve issues'
    ],
    contentData: {
      sections: [
        { title: 'Common Frequency Problems', type: 'text' },
        { title: 'The EQ Sweep Technique', type: 'video' },
        { title: 'Practice: Find the Problem', type: 'interactive' }
      ]
    }
  },
  {
    id: 'freq-lesson-advanced',
    title: 'Advanced Frequency Analysis',
    description: 'Master spectrum analyzers and advanced frequency identification techniques.',
    category: SkillCategory.FREQUENCY_FINDER,
    contentType: ContentType.LESSON,
    difficulty: DifficultyLevel.ADVANCED,
    estimatedDuration: 25,
    prerequisites: ['freq-lesson-problem-areas'],
    objectives: [
      'Use spectrum analyzers effectively',
      'Understand masking and frequency conflicts',
      'Apply complementary EQ between instruments'
    ],
    contentData: {
      sections: [
        { title: 'Reading Spectrum Analyzers', type: 'interactive' },
        { title: 'Frequency Masking', type: 'audio_example' },
        { title: 'Complementary EQ Strategies', type: 'text' }
      ]
    }
  },
  // Mini-games
  {
    id: 'freq-game-identify',
    title: 'Frequency Finder Challenge',
    description: 'Test your ears! Identify which frequency is being boosted or cut in real-time.',
    category: SkillCategory.FREQUENCY_FINDER,
    contentType: ContentType.MINI_GAME,
    difficulty: DifficultyLevel.BEGINNER,
    estimatedDuration: 10,
    objectives: ['Improve frequency identification skills'],
    contentData: {
      gameType: 'frequency_identification',
      rounds: 10,
      timePerRound: 15,
      difficultyProgression: true
    }
  },
  {
    id: 'freq-game-match',
    title: 'EQ Matching Game',
    description: 'Match the frequency response of one audio clip to another using EQ.',
    category: SkillCategory.FREQUENCY_FINDER,
    contentType: ContentType.MINI_GAME,
    difficulty: DifficultyLevel.INTERMEDIATE,
    estimatedDuration: 15,
    prerequisites: ['freq-game-identify'],
    objectives: ['Apply EQ to match reference sounds'],
    contentData: {
      gameType: 'eq_matching',
      rounds: 5,
      scoring: { perfect: 100, close: 75, acceptable: 50 }
    }
  },
  // Quizzes
  {
    id: 'freq-quiz-basics',
    title: 'Frequency Fundamentals Quiz',
    description: 'Test your knowledge of audio frequency concepts.',
    category: SkillCategory.FREQUENCY_FINDER,
    contentType: ContentType.QUIZ,
    difficulty: DifficultyLevel.BEGINNER,
    estimatedDuration: 10,
    prerequisites: ['freq-lesson-basics'],
    objectives: ['Assess understanding of frequency concepts'],
    contentData: {
      questionCount: 10,
      passingScore: 70,
      questionPool: ['freq-1', 'freq-2']
    }
  },

  // ==================== EQ SKILL CONTENT ====================
  {
    id: 'eq-lesson-basics',
    title: 'EQ Fundamentals',
    description: 'Learn the basics of equalization and how to use different EQ types.',
    category: SkillCategory.EQ_SKILL,
    contentType: ContentType.LESSON,
    difficulty: DifficultyLevel.BEGINNER,
    estimatedDuration: 20,
    objectives: [
      'Understand parametric, graphic, and shelf EQ types',
      'Learn EQ parameters: frequency, gain, Q/bandwidth',
      'Know when to use different filter types'
    ],
    contentData: {
      sections: [
        { title: 'Types of EQ', type: 'text' },
        { title: 'EQ Parameters Explained', type: 'interactive' },
        { title: 'Filter Types', type: 'audio_example' }
      ]
    }
  },
  {
    id: 'eq-lesson-vocals',
    title: 'EQ for Vocals',
    description: 'Master EQ techniques specifically for vocal tracks.',
    category: SkillCategory.EQ_SKILL,
    contentType: ContentType.LESSON,
    difficulty: DifficultyLevel.INTERMEDIATE,
    estimatedDuration: 25,
    prerequisites: ['eq-lesson-basics'],
    objectives: [
      'Apply high-pass filtering to clean up vocals',
      'Enhance clarity and presence in vocals',
      'Control sibilance and harshness'
    ],
    contentData: {
      sections: [
        { title: 'Vocal Frequency Anatomy', type: 'text' },
        { title: 'Common Vocal EQ Moves', type: 'video' },
        { title: 'Before/After Examples', type: 'audio_example' }
      ]
    }
  },
  {
    id: 'eq-lesson-mastering',
    title: 'Mastering EQ Techniques',
    description: 'Learn advanced EQ techniques used in mastering.',
    category: SkillCategory.EQ_SKILL,
    contentType: ContentType.LESSON,
    difficulty: DifficultyLevel.EXPERT,
    estimatedDuration: 30,
    prerequisites: ['eq-lesson-vocals'],
    objectives: [
      'Apply subtle corrective EQ on master bus',
      'Use mid/side EQ for stereo enhancement',
      'Understand linear phase EQ applications'
    ],
    contentData: {
      sections: [
        { title: 'Mastering vs Mixing EQ', type: 'text' },
        { title: 'Mid/Side Processing', type: 'interactive' },
        { title: 'Linear Phase Considerations', type: 'text' }
      ]
    }
  },
  {
    id: 'eq-game-surgeon',
    title: 'EQ Surgeon',
    description: 'Precisely cut problem frequencies in mixed audio.',
    category: SkillCategory.EQ_SKILL,
    contentType: ContentType.MINI_GAME,
    difficulty: DifficultyLevel.INTERMEDIATE,
    estimatedDuration: 15,
    objectives: ['Practice surgical EQ cuts'],
    contentData: {
      gameType: 'surgical_eq',
      rounds: 8,
      toleranceRange: 50
    }
  },
  {
    id: 'eq-quiz-advanced',
    title: 'Advanced EQ Quiz',
    description: 'Test your knowledge of advanced EQ concepts.',
    category: SkillCategory.EQ_SKILL,
    contentType: ContentType.QUIZ,
    difficulty: DifficultyLevel.ADVANCED,
    estimatedDuration: 15,
    prerequisites: ['eq-lesson-mastering'],
    objectives: ['Assess advanced EQ knowledge'],
    contentData: {
      questionCount: 15,
      passingScore: 75,
      questionPool: ['eq-3', 'eq-4', 'eq-5']
    }
  },

  // ==================== BALANCING CONTENT ====================
  {
    id: 'bal-lesson-basics',
    title: 'Mix Balancing Fundamentals',
    description: 'Learn the essentials of balancing levels in a mix.',
    category: SkillCategory.BALANCING,
    contentType: ContentType.LESSON,
    difficulty: DifficultyLevel.BEGINNER,
    estimatedDuration: 20,
    objectives: [
      'Understand gain staging principles',
      'Learn to set proper initial levels',
      'Establish priority elements in different genres'
    ],
    contentData: {
      sections: [
        { title: 'What is Mix Balance?', type: 'text' },
        { title: 'Gain Staging Explained', type: 'interactive' },
        { title: 'Genre-Specific Priorities', type: 'audio_example' }
      ]
    }
  },
  {
    id: 'bal-lesson-panning',
    title: 'Panning and Stereo Field',
    description: 'Master stereo placement and width in your mixes.',
    category: SkillCategory.BALANCING,
    contentType: ContentType.LESSON,
    difficulty: DifficultyLevel.INTERMEDIATE,
    estimatedDuration: 25,
    prerequisites: ['bal-lesson-basics'],
    objectives: [
      'Create effective stereo panorama',
      'Balance mono and stereo elements',
      'Avoid common panning mistakes'
    ],
    contentData: {
      sections: [
        { title: 'The Stereo Field', type: 'interactive' },
        { title: 'What Goes Where', type: 'text' },
        { title: 'Panning Best Practices', type: 'audio_example' }
      ]
    }
  },
  {
    id: 'bal-game-fader-ride',
    title: 'Fader Rider Challenge',
    description: 'Balance a mix using only faders - no processing allowed!',
    category: SkillCategory.BALANCING,
    contentType: ContentType.MINI_GAME,
    difficulty: DifficultyLevel.BEGINNER,
    estimatedDuration: 12,
    objectives: ['Practice mix balancing by ear'],
    contentData: {
      gameType: 'fader_balance',
      tracks: 8,
      targetReference: true
    }
  },
  {
    id: 'bal-game-panning',
    title: 'Pan Position Challenge',
    description: 'Place instruments correctly in the stereo field.',
    category: SkillCategory.BALANCING,
    contentType: ContentType.MINI_GAME,
    difficulty: DifficultyLevel.INTERMEDIATE,
    estimatedDuration: 10,
    prerequisites: ['bal-lesson-panning'],
    objectives: ['Master stereo placement decisions'],
    contentData: {
      gameType: 'pan_positioning',
      rounds: 6,
      instrumentTypes: ['drums', 'guitars', 'keys', 'vocals']
    }
  },
  {
    id: 'bal-quiz-comprehensive',
    title: 'Balance & Levels Quiz',
    description: 'Test your knowledge of mixing balance concepts.',
    category: SkillCategory.BALANCING,
    contentType: ContentType.QUIZ,
    difficulty: DifficultyLevel.INTERMEDIATE,
    estimatedDuration: 12,
    prerequisites: ['bal-lesson-panning'],
    objectives: ['Assess balance knowledge'],
    contentData: {
      questionCount: 12,
      passingScore: 70,
      questionPool: ['bal-1', 'bal-2', 'bal-4', 'bal-5']
    }
  },

  // ==================== COMPRESSION CONTENT ====================
  {
    id: 'comp-lesson-basics',
    title: 'Compression 101',
    description: 'Understand what compression does and when to use it.',
    category: SkillCategory.COMPRESSION,
    contentType: ContentType.LESSON,
    difficulty: DifficultyLevel.BEGINNER,
    estimatedDuration: 20,
    objectives: [
      'Understand dynamic range and compression purpose',
      'Learn compressor parameters (threshold, ratio, attack, release)',
      'Recognize compression in audio examples'
    ],
    contentData: {
      sections: [
        { title: 'What is Compression?', type: 'text' },
        { title: 'Compressor Controls', type: 'interactive' },
        { title: 'Hear the Difference', type: 'audio_example' }
      ]
    }
  },
  {
    id: 'comp-lesson-drums',
    title: 'Compressing Drums',
    description: 'Master compression techniques for drums and percussion.',
    category: SkillCategory.COMPRESSION,
    contentType: ContentType.LESSON,
    difficulty: DifficultyLevel.INTERMEDIATE,
    estimatedDuration: 25,
    prerequisites: ['comp-lesson-basics'],
    objectives: [
      'Set appropriate attack/release for drums',
      'Balance punch with control',
      'Use parallel compression on drums'
    ],
    contentData: {
      sections: [
        { title: 'Drum Dynamics', type: 'text' },
        { title: 'Attack/Release for Punch', type: 'interactive' },
        { title: 'Parallel Compression Demo', type: 'video' }
      ]
    }
  },
  {
    id: 'comp-lesson-mastering',
    title: 'Mastering Compression & Limiting',
    description: 'Advanced compression and limiting techniques for mastering.',
    category: SkillCategory.COMPRESSION,
    contentType: ContentType.LESSON,
    difficulty: DifficultyLevel.EXPERT,
    estimatedDuration: 30,
    prerequisites: ['comp-lesson-drums'],
    objectives: [
      'Apply transparent mastering compression',
      'Use multiband compression effectively',
      'Set limiters for loudness targets'
    ],
    contentData: {
      sections: [
        { title: 'Mastering Chain Compression', type: 'text' },
        { title: 'Multiband Strategies', type: 'interactive' },
        { title: 'Limiting & LUFS Targets', type: 'audio_example' }
      ]
    }
  },
  {
    id: 'comp-game-detector',
    title: 'Compression Detective',
    description: 'Can you hear compression? Test your ears!',
    category: SkillCategory.COMPRESSION,
    contentType: ContentType.MINI_GAME,
    difficulty: DifficultyLevel.BEGINNER,
    estimatedDuration: 8,
    objectives: ['Train ears to recognize compression'],
    contentData: {
      gameType: 'compression_detection',
      rounds: 10,
      abComparison: true
    }
  },
  {
    id: 'comp-game-settings',
    title: 'Dial It In',
    description: 'Match compressor settings to achieve target sound.',
    category: SkillCategory.COMPRESSION,
    contentType: ContentType.MINI_GAME,
    difficulty: DifficultyLevel.ADVANCED,
    estimatedDuration: 15,
    prerequisites: ['comp-lesson-drums'],
    objectives: ['Master compressor parameter adjustment'],
    contentData: {
      gameType: 'compression_matching',
      rounds: 6,
      parameters: ['threshold', 'ratio', 'attack', 'release']
    }
  },
  {
    id: 'comp-quiz-comprehensive',
    title: 'Compression Mastery Quiz',
    description: 'Test your compression knowledge.',
    category: SkillCategory.COMPRESSION,
    contentType: ContentType.QUIZ,
    difficulty: DifficultyLevel.INTERMEDIATE,
    estimatedDuration: 15,
    prerequisites: ['comp-lesson-drums'],
    objectives: ['Assess compression understanding'],
    contentData: {
      questionCount: 15,
      passingScore: 70,
      questionPool: ['comp-1', 'comp-2', 'comp-3', 'comp-5']
    }
  },

  // ==================== SONG STRUCTURE CONTENT ====================
  {
    id: 'struct-lesson-basics',
    title: 'Song Structure Fundamentals',
    description: 'Learn common song structures and arrangement principles.',
    category: SkillCategory.SONG_STRUCTURE,
    contentType: ContentType.LESSON,
    difficulty: DifficultyLevel.BEGINNER,
    estimatedDuration: 20,
    objectives: [
      'Identify common song sections (verse, chorus, bridge)',
      'Understand arrangement conventions by genre',
      'Recognize structural elements in reference tracks'
    ],
    contentData: {
      sections: [
        { title: 'Song Sections Explained', type: 'text' },
        { title: 'Genre-Specific Structures', type: 'audio_example' },
        { title: 'Analyzing References', type: 'interactive' }
      ]
    }
  },
  {
    id: 'struct-lesson-transitions',
    title: 'Mastering Transitions',
    description: 'Create smooth and impactful transitions between sections.',
    category: SkillCategory.SONG_STRUCTURE,
    contentType: ContentType.LESSON,
    difficulty: DifficultyLevel.INTERMEDIATE,
    estimatedDuration: 25,
    prerequisites: ['struct-lesson-basics'],
    objectives: [
      'Use automation for transitions',
      'Apply effects for section changes',
      'Build and release tension effectively'
    ],
    contentData: {
      sections: [
        { title: 'Transition Techniques', type: 'text' },
        { title: 'Automation in Practice', type: 'interactive' },
        { title: 'Build-ups and Drops', type: 'audio_example' }
      ]
    }
  },
  {
    id: 'struct-lesson-edm',
    title: 'EDM Arrangement Masterclass',
    description: 'Advanced arrangement techniques for electronic dance music.',
    category: SkillCategory.SONG_STRUCTURE,
    contentType: ContentType.LESSON,
    difficulty: DifficultyLevel.EXPERT,
    estimatedDuration: 30,
    prerequisites: ['struct-lesson-transitions'],
    objectives: [
      'Structure tracks for DJ mixing',
      'Create effective build-ups and drops',
      'Arrange for maximum dancefloor impact'
    ],
    contentData: {
      sections: [
        { title: 'EDM Structure Overview', type: 'text' },
        { title: 'The Drop Mechanics', type: 'video' },
        { title: 'Full Track Analysis', type: 'interactive' }
      ]
    }
  },
  {
    id: 'struct-game-arranger',
    title: 'Arrangement Puzzler',
    description: 'Arrange song sections in the correct order.',
    category: SkillCategory.SONG_STRUCTURE,
    contentType: ContentType.MINI_GAME,
    difficulty: DifficultyLevel.BEGINNER,
    estimatedDuration: 10,
    objectives: ['Practice song arrangement logic'],
    contentData: {
      gameType: 'section_ordering',
      rounds: 5,
      genres: ['pop', 'rock', 'edm']
    }
  },
  {
    id: 'struct-game-transition',
    title: 'Transition Master',
    description: 'Choose the best transition effect for each scenario.',
    category: SkillCategory.SONG_STRUCTURE,
    contentType: ContentType.MINI_GAME,
    difficulty: DifficultyLevel.INTERMEDIATE,
    estimatedDuration: 12,
    prerequisites: ['struct-lesson-transitions'],
    objectives: ['Master transition decisions'],
    contentData: {
      gameType: 'transition_selection',
      rounds: 8,
      options: ['riser', 'filter_sweep', 'reverb_tail', 'crash_cymbal']
    }
  },
  {
    id: 'struct-quiz-comprehensive',
    title: 'Arrangement & Structure Quiz',
    description: 'Test your knowledge of song structure.',
    category: SkillCategory.SONG_STRUCTURE,
    contentType: ContentType.QUIZ,
    difficulty: DifficultyLevel.INTERMEDIATE,
    estimatedDuration: 12,
    prerequisites: ['struct-lesson-transitions'],
    objectives: ['Assess arrangement knowledge'],
    contentData: {
      questionCount: 12,
      passingScore: 70,
      questionPool: ['struct-1', 'struct-2', 'struct-4']
    }
  }
];

/**
 * Get learning content by category
 */
export function getContentByCategory(category: SkillCategory): LearningContent[] {
  return learningContentLibrary.filter(c => c.category === category);
}

/**
 * Get learning content by difficulty
 */
export function getContentByDifficulty(difficulty: DifficultyLevel): LearningContent[] {
  return learningContentLibrary.filter(c => c.difficulty === difficulty);
}

/**
 * Get learning content by type
 */
export function getContentByType(contentType: ContentType): LearningContent[] {
  return learningContentLibrary.filter(c => c.contentType === contentType);
}

/**
 * Get content suitable for a specific skill level
 * Returns content at or below the specified difficulty
 */
export function getContentForSkillLevel(
  category: SkillCategory,
  maxDifficulty: DifficultyLevel
): LearningContent[] {
  return learningContentLibrary.filter(
    c => c.category === category && c.difficulty <= maxDifficulty
  );
}

/**
 * Get content by ID
 */
export function getContentById(id: string): LearningContent | undefined {
  return learningContentLibrary.find(c => c.id === id);
}
