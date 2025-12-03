import { AssessmentQuestion, SkillCategory, QuestionType, DifficultyLevel } from '../types';

/**
 * Index map for O(1) category lookups - populated lazily
 */
let questionsByCategoryIndex: Map<SkillCategory, AssessmentQuestion[]> | null = null;

/**
 * Builds index map from the question bank for efficient lookups
 */
function buildQuestionIndex(): void {
  questionsByCategoryIndex = new Map();
  
  for (const category of Object.values(SkillCategory)) {
    questionsByCategoryIndex.set(category, []);
  }
  
  for (const question of assessmentQuestionBank) {
    questionsByCategoryIndex.get(question.category)!.push(question);
  }
}

/**
 * Ensures index is built (lazy initialization)
 */
function ensureQuestionIndex(): void {
  if (questionsByCategoryIndex === null) {
    buildQuestionIndex();
  }
}

/**
 * Assessment question bank organized by skill category
 * Each category has questions of varying difficulty to accurately assess user level
 */
export const assessmentQuestionBank: AssessmentQuestion[] = [
  // ==================== FREQUENCY FINDER QUESTIONS ====================
  {
    id: 'freq-1',
    category: SkillCategory.FREQUENCY_FINDER,
    questionType: QuestionType.MULTIPLE_CHOICE,
    difficulty: DifficultyLevel.INTERMEDIATE,
    prompt: 'Which frequency range is typically associated with "muddiness" in a mix?',
    options: [
      { id: 'a', text: '20-60 Hz (Sub-bass)' },
      { id: 'b', text: '200-500 Hz (Low-mids)' },
      { id: 'c', text: '2-4 kHz (Upper-mids)' },
      { id: 'd', text: '10-16 kHz (Air)' }
    ],
    correctAnswer: 'b',
    points: 10
  },
  {
    id: 'freq-2',
    category: SkillCategory.FREQUENCY_FINDER,
    questionType: QuestionType.MULTIPLE_CHOICE,
    difficulty: DifficultyLevel.BEGINNER,
    prompt: 'What frequency range contains the fundamental frequencies of most bass guitars and kick drums?',
    options: [
      { id: 'a', text: '40-100 Hz' },
      { id: 'b', text: '500-1000 Hz' },
      { id: 'c', text: '2-5 kHz' },
      { id: 'd', text: '8-12 kHz' }
    ],
    correctAnswer: 'a',
    points: 10
  },
  {
    id: 'freq-3',
    category: SkillCategory.FREQUENCY_FINDER,
    questionType: QuestionType.MULTIPLE_CHOICE,
    difficulty: DifficultyLevel.ADVANCED,
    prompt: 'When trying to add "presence" and clarity to vocals, which frequency range should you boost?',
    options: [
      { id: 'a', text: '100-200 Hz' },
      { id: 'b', text: '400-600 Hz' },
      { id: 'c', text: '2-5 kHz' },
      { id: 'd', text: '12-16 kHz' }
    ],
    correctAnswer: 'c',
    points: 15
  },
  {
    id: 'freq-4',
    category: SkillCategory.FREQUENCY_FINDER,
    questionType: QuestionType.AUDIO_IDENTIFICATION,
    difficulty: DifficultyLevel.INTERMEDIATE,
    prompt: 'Listen to the audio. A boost has been applied. Identify the approximate frequency range that was boosted.',
    audioUrl: '/audio/freq-boost-test-1.mp3',
    options: [
      { id: 'a', text: '80 Hz' },
      { id: 'b', text: '250 Hz' },
      { id: 'c', text: '1 kHz' },
      { id: 'd', text: '4 kHz' }
    ],
    correctAnswer: 'c',
    points: 15
  },
  {
    id: 'freq-5',
    category: SkillCategory.FREQUENCY_FINDER,
    questionType: QuestionType.MULTIPLE_CHOICE,
    difficulty: DifficultyLevel.EXPERT,
    prompt: 'Which frequency range is known as the "harshness" or "sibilance" zone that often needs careful treatment?',
    options: [
      { id: 'a', text: '500-800 Hz' },
      { id: 'b', text: '1-2 kHz' },
      { id: 'c', text: '5-8 kHz' },
      { id: 'd', text: '12-16 kHz' }
    ],
    correctAnswer: 'c',
    points: 20
  },

  // ==================== EQ SKILL QUESTIONS ====================
  {
    id: 'eq-1',
    category: SkillCategory.EQ_SKILL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    difficulty: DifficultyLevel.BEGINNER,
    prompt: 'What does a high-pass filter do?',
    options: [
      { id: 'a', text: 'Removes frequencies above the cutoff point' },
      { id: 'b', text: 'Removes frequencies below the cutoff point' },
      { id: 'c', text: 'Boosts all frequencies equally' },
      { id: 'd', text: 'Removes frequencies in the middle range' }
    ],
    correctAnswer: 'b',
    points: 10
  },
  {
    id: 'eq-2',
    category: SkillCategory.EQ_SKILL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    difficulty: DifficultyLevel.INTERMEDIATE,
    prompt: 'What is the "Q" or bandwidth parameter in parametric EQ?',
    options: [
      { id: 'a', text: 'The quality of the audio signal' },
      { id: 'b', text: 'The width of the frequency range affected by the EQ band' },
      { id: 'c', text: 'The maximum boost available' },
      { id: 'd', text: 'The output volume level' }
    ],
    correctAnswer: 'b',
    points: 10
  },
  {
    id: 'eq-3',
    category: SkillCategory.EQ_SKILL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    difficulty: DifficultyLevel.ADVANCED,
    prompt: 'When should you use subtractive EQ instead of additive EQ?',
    options: [
      { id: 'a', text: 'When you want to add brightness to a track' },
      { id: 'b', text: 'When removing problematic frequencies or making room for other instruments' },
      { id: 'c', text: 'Only on master bus processing' },
      { id: 'd', text: 'Subtractive EQ should never be used' }
    ],
    correctAnswer: 'b',
    points: 15
  },
  {
    id: 'eq-4',
    category: SkillCategory.EQ_SKILL,
    questionType: QuestionType.INTERACTIVE_MINIGAME,
    difficulty: DifficultyLevel.INTERMEDIATE,
    prompt: 'Match the EQ to make Sample B sound like Sample A. Adjust the frequency, gain, and Q.',
    audioUrl: '/audio/eq-match-test-1.mp3',
    correctAnswer: ['freq:2000', 'gain:+3', 'q:1.5'],
    points: 20,
    metadata: {
      targetFreq: 2000,
      targetGain: 3,
      targetQ: 1.5,
      tolerance: { freq: 200, gain: 1, q: 0.5 }
    }
  },
  {
    id: 'eq-5',
    category: SkillCategory.EQ_SKILL,
    questionType: QuestionType.MULTIPLE_CHOICE,
    difficulty: DifficultyLevel.EXPERT,
    prompt: 'What is a linear phase EQ best used for?',
    options: [
      { id: 'a', text: 'Adding color and character to individual tracks' },
      { id: 'b', text: 'Master bus processing where phase coherence is critical' },
      { id: 'c', text: 'Real-time live performance mixing' },
      { id: 'd', text: 'Extreme surgical cuts on drums' }
    ],
    correctAnswer: 'b',
    points: 20
  },

  // ==================== BALANCING QUESTIONS ====================
  {
    id: 'bal-1',
    category: SkillCategory.BALANCING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    difficulty: DifficultyLevel.BEGINNER,
    prompt: 'What is the primary goal of gain staging?',
    options: [
      { id: 'a', text: 'To make the mix as loud as possible' },
      { id: 'b', text: 'To ensure optimal signal levels throughout the signal chain without clipping' },
      { id: 'c', text: 'To add reverb to all tracks' },
      { id: 'd', text: 'To pan all instruments to center' }
    ],
    correctAnswer: 'b',
    points: 10
  },
  {
    id: 'bal-2',
    category: SkillCategory.BALANCING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    difficulty: DifficultyLevel.INTERMEDIATE,
    prompt: 'When balancing a mix, what should typically be the loudest element in a pop/rock song?',
    options: [
      { id: 'a', text: 'Cymbals and hi-hats' },
      { id: 'b', text: 'Background vocals' },
      { id: 'c', text: 'Lead vocals and kick drum' },
      { id: 'd', text: 'Rhythm guitar' }
    ],
    correctAnswer: 'c',
    points: 10
  },
  {
    id: 'bal-3',
    category: SkillCategory.BALANCING,
    questionType: QuestionType.SLIDER_MATCH,
    difficulty: DifficultyLevel.ADVANCED,
    prompt: 'Adjust the faders to balance this mix. Set appropriate levels for kick, snare, bass, and vocals.',
    audioUrl: '/audio/balance-test-1.mp3',
    correctAnswer: ['kick:-6', 'snare:-8', 'bass:-10', 'vocals:-4'],
    points: 20,
    metadata: {
      tracks: ['kick', 'snare', 'bass', 'vocals'],
      targetLevels: { kick: -6, snare: -8, bass: -10, vocals: -4 },
      tolerance: 2
    }
  },
  {
    id: 'bal-4',
    category: SkillCategory.BALANCING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    difficulty: DifficultyLevel.EXPERT,
    prompt: 'What is the recommended headroom to leave on the master bus before mastering?',
    options: [
      { id: 'a', text: '0 dB - maximize loudness' },
      { id: 'b', text: '-3 to -6 dB' },
      { id: 'c', text: '-12 to -15 dB' },
      { id: 'd', text: '-20 dB or lower' }
    ],
    correctAnswer: 'b',
    points: 15
  },
  {
    id: 'bal-5',
    category: SkillCategory.BALANCING,
    questionType: QuestionType.MULTIPLE_CHOICE,
    difficulty: DifficultyLevel.INTERMEDIATE,
    prompt: 'What does "panning" achieve in a mix?',
    options: [
      { id: 'a', text: 'Changes the pitch of instruments' },
      { id: 'b', text: 'Controls the stereo placement of sounds in the left-right spectrum' },
      { id: 'c', text: 'Adds delay effects' },
      { id: 'd', text: 'Increases the overall volume' }
    ],
    correctAnswer: 'b',
    points: 10
  },

  // ==================== COMPRESSION QUESTIONS ====================
  {
    id: 'comp-1',
    category: SkillCategory.COMPRESSION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    difficulty: DifficultyLevel.BEGINNER,
    prompt: 'What is the main purpose of audio compression?',
    options: [
      { id: 'a', text: 'To make the file size smaller' },
      { id: 'b', text: 'To reduce the dynamic range by attenuating loud signals' },
      { id: 'c', text: 'To add reverb and delay' },
      { id: 'd', text: 'To change the pitch of audio' }
    ],
    correctAnswer: 'b',
    points: 10
  },
  {
    id: 'comp-2',
    category: SkillCategory.COMPRESSION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    difficulty: DifficultyLevel.INTERMEDIATE,
    prompt: 'What does the "ratio" parameter in a compressor control?',
    options: [
      { id: 'a', text: 'How quickly the compressor activates' },
      { id: 'b', text: 'The amount of gain reduction applied once the signal exceeds the threshold' },
      { id: 'c', text: 'The output volume level' },
      { id: 'd', text: 'The stereo width of the signal' }
    ],
    correctAnswer: 'b',
    points: 10
  },
  {
    id: 'comp-3',
    category: SkillCategory.COMPRESSION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    difficulty: DifficultyLevel.ADVANCED,
    prompt: 'What is parallel compression (New York compression)?',
    options: [
      { id: 'a', text: 'Using two compressors in series' },
      { id: 'b', text: 'Blending heavily compressed signal with the original dry signal' },
      { id: 'c', text: 'Compressing the left and right channels separately' },
      { id: 'd', text: 'Using compression only on high frequencies' }
    ],
    correctAnswer: 'b',
    points: 15
  },
  {
    id: 'comp-4',
    category: SkillCategory.COMPRESSION,
    questionType: QuestionType.AUDIO_IDENTIFICATION,
    difficulty: DifficultyLevel.INTERMEDIATE,
    prompt: 'Listen to the two samples. Which one has compression applied?',
    audioUrl: '/audio/compression-ab-test-1.mp3',
    options: [
      { id: 'a', text: 'Sample A' },
      { id: 'b', text: 'Sample B' },
      { id: 'c', text: 'Both samples' },
      { id: 'd', text: 'Neither sample' }
    ],
    correctAnswer: 'b',
    points: 15
  },
  {
    id: 'comp-5',
    category: SkillCategory.COMPRESSION,
    questionType: QuestionType.MULTIPLE_CHOICE,
    difficulty: DifficultyLevel.EXPERT,
    prompt: 'When would you use a slower attack time on a compressor?',
    options: [
      { id: 'a', text: 'To catch every transient and heavily control dynamics' },
      { id: 'b', text: 'To let transients through and preserve punch while controlling sustain' },
      { id: 'c', text: 'Slow attack should never be used' },
      { id: 'd', text: 'Only on vocals' }
    ],
    correctAnswer: 'b',
    points: 20
  },

  // ==================== SONG STRUCTURE QUESTIONS ====================
  {
    id: 'struct-1',
    category: SkillCategory.SONG_STRUCTURE,
    questionType: QuestionType.MULTIPLE_CHOICE,
    difficulty: DifficultyLevel.BEGINNER,
    prompt: 'What is a typical order of sections in a pop song?',
    options: [
      { id: 'a', text: 'Chorus - Verse - Bridge - Outro' },
      { id: 'b', text: 'Intro - Verse - Chorus - Verse - Chorus - Bridge - Chorus - Outro' },
      { id: 'c', text: 'Bridge - Verse - Verse - End' },
      { id: 'd', text: 'Solo - Verse - Chorus - Solo' }
    ],
    correctAnswer: 'b',
    points: 10
  },
  {
    id: 'struct-2',
    category: SkillCategory.SONG_STRUCTURE,
    questionType: QuestionType.MULTIPLE_CHOICE,
    difficulty: DifficultyLevel.INTERMEDIATE,
    prompt: 'What is the purpose of a "build" or "riser" section in electronic music?',
    options: [
      { id: 'a', text: 'To provide a quiet moment for listener rest' },
      { id: 'b', text: 'To create tension and anticipation before a drop or chorus' },
      { id: 'c', text: 'To introduce new lyrics' },
      { id: 'd', text: 'To end the song gradually' }
    ],
    correctAnswer: 'b',
    points: 10
  },
  {
    id: 'struct-3',
    category: SkillCategory.SONG_STRUCTURE,
    questionType: QuestionType.ORDERING,
    difficulty: DifficultyLevel.ADVANCED,
    prompt: 'Arrange these mix elements in the order they should typically be introduced in an EDM track build-up.',
    options: [
      { id: 'a', text: 'Sub bass' },
      { id: 'b', text: 'Hi-hats and cymbals' },
      { id: 'c', text: 'Kick drum' },
      { id: 'd', text: 'White noise riser' }
    ],
    correctAnswer: ['c', 'b', 'd', 'a'],
    points: 15
  },
  {
    id: 'struct-4',
    category: SkillCategory.SONG_STRUCTURE,
    questionType: QuestionType.MULTIPLE_CHOICE,
    difficulty: DifficultyLevel.INTERMEDIATE,
    prompt: 'What mixing technique is commonly used during song transitions to smooth the change between sections?',
    options: [
      { id: 'a', text: 'Hard cut with silence' },
      { id: 'b', text: 'Reverb/delay tails, filter sweeps, and volume automation' },
      { id: 'c', text: 'Extreme compression' },
      { id: 'd', text: 'Pitch shifting all elements' }
    ],
    correctAnswer: 'b',
    points: 10
  },
  {
    id: 'struct-5',
    category: SkillCategory.SONG_STRUCTURE,
    questionType: QuestionType.MULTIPLE_CHOICE,
    difficulty: DifficultyLevel.EXPERT,
    prompt: 'In mastering, how should LUFS targets typically differ between a quiet intro and the main body of a song?',
    options: [
      { id: 'a', text: 'They should be exactly the same throughout' },
      { id: 'b', text: 'Intro should be louder to grab attention' },
      { id: 'c', text: 'Natural dynamics should be preserved - intro can be quieter' },
      { id: 'd', text: 'LUFS is not relevant to song structure' }
    ],
    correctAnswer: 'c',
    points: 20
  }
];

/**
 * Get questions for a specific category - O(1) lookup using index
 */
export function getQuestionsByCategory(category: SkillCategory): AssessmentQuestion[] {
  ensureQuestionIndex();
  return questionsByCategoryIndex!.get(category) ?? [];
}

/**
 * Get a randomized set of questions for the initial assessment
 * Ensures balanced coverage of categories and difficulty levels
 */
export function getAssessmentQuestions(questionsPerCategory: number = 3): AssessmentQuestion[] {
  const questions: AssessmentQuestion[] = [];
  
  for (const category of Object.values(SkillCategory)) {
    const categoryQuestions = getQuestionsByCategory(category);
    
    // Sort by difficulty to ensure we get a range
    const sorted = [...categoryQuestions].sort((a, b) => a.difficulty - b.difficulty);
    
    // Select questions ensuring difficulty variety
    const selected = sorted.slice(0, questionsPerCategory);
    questions.push(...selected);
  }
  
  return questions;
}
