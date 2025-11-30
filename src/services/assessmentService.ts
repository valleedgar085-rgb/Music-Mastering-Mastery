import { v4 as uuidv4 } from 'uuid';
import {
  AssessmentQuestion,
  AssessmentResult,
  SectionResult,
  UserAnswer,
  SkillCategory,
  DifficultyLevel
} from '../types';
import { getAssessmentQuestions, getQuestionsByCategory } from '../models/questionBank';

/**
 * Service for managing skill assessments
 */
export class AssessmentService {
  /**
   * Generate a new assessment for a user
   * The assessment is designed to be slightly challenging to ensure accurate level placement
   */
  generateAssessment(questionsPerCategory: number = 3): {
    assessmentId: string;
    questions: AssessmentQuestion[];
  } {
    const questions = getAssessmentQuestions(questionsPerCategory);
    
    return {
      assessmentId: uuidv4(),
      questions
    };
  }

  /**
   * Score a user's assessment answers
   */
  scoreAssessment(
    assessmentId: string,
    userId: string,
    answers: Map<string, string | string[]>,
    questions: AssessmentQuestion[],
    startTime: Date
  ): AssessmentResult {
    const sectionResults = new Map<SkillCategory, UserAnswer[]>();

    // Initialize section results for all categories
    for (const category of Object.values(SkillCategory)) {
      sectionResults.set(category, []);
    }

    // Score each answer
    for (const question of questions) {
      const userAnswer = answers.get(question.id);
      const scored = this.scoreAnswer(question, userAnswer);
      
      const categoryAnswers = sectionResults.get(question.category) ?? [];
      categoryAnswers.push(scored);
      sectionResults.set(question.category, categoryAnswers);
    }

    // Calculate section scores
    const sections: SectionResult[] = [];
    for (const [category, categoryAnswers] of sectionResults) {
      if (categoryAnswers.length > 0) {
        const section = this.calculateSectionResult(category, categoryAnswers, questions);
        sections.push(section);
      }
    }

    // Calculate overall score
    const overallScore = this.calculateOverallScore(sections);

    // Generate recommendations based on results
    const recommendations = this.generateRecommendations(sections);

    return {
      id: assessmentId,
      userId,
      startedAt: startTime,
      completedAt: new Date(),
      sections,
      overallScore,
      recommendations
    };
  }

  /**
   * Score an individual answer
   */
  private scoreAnswer(
    question: AssessmentQuestion,
    userAnswer: string | string[] | undefined
  ): UserAnswer {
    let isCorrect = false;

    if (userAnswer !== undefined) {
      if (Array.isArray(question.correctAnswer)) {
        // For ordering questions, check if arrays match
        if (Array.isArray(userAnswer)) {
          isCorrect = this.arraysEqual(question.correctAnswer, userAnswer);
        }
      } else {
        // For single answer questions
        isCorrect = question.correctAnswer === userAnswer;
      }
    }

    // For interactive questions with tolerance, use fuzzy matching
    if (question.metadata?.tolerance && userAnswer) {
      isCorrect = this.checkWithTolerance(question, userAnswer);
    }

    return {
      questionId: question.id,
      answer: userAnswer ?? '',
      timeTaken: 0, // Would be tracked in real implementation
      isCorrect,
      pointsEarned: isCorrect ? question.points : 0
    };
  }

  /**
   * Check answer with tolerance for interactive questions
   */
  private checkWithTolerance(
    question: AssessmentQuestion,
    userAnswer: string | string[]
  ): boolean {
    const tolerance = question.metadata?.tolerance as Record<string, number> | undefined;
    if (!tolerance) return false;

    // Parse user answers (e.g., ['freq:2100', 'gain:+2.5', 'q:1.3'])
    if (Array.isArray(userAnswer) && Array.isArray(question.correctAnswer)) {
      return userAnswer.every((ans, idx) => {
        const [param, valueStr] = ans.split(':');
        const [, correctValueStr] = question.correctAnswer[idx].split(':');
        const value = parseFloat(valueStr);
        const correctValue = parseFloat(correctValueStr);
        const paramTolerance = tolerance[param] ?? 0;
        
        return Math.abs(value - correctValue) <= paramTolerance;
      });
    }

    return false;
  }

  /**
   * Helper to compare arrays for ordering questions
   */
  private arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((val, idx) => val === b[idx]);
  }

  /**
   * Calculate results for a single section/category
   */
  private calculateSectionResult(
    category: SkillCategory,
    answers: UserAnswer[],
    questions: AssessmentQuestion[]
  ): SectionResult {
    const categoryQuestions = questions.filter(q => q.category === category);
    const totalPoints = categoryQuestions.reduce((sum, q) => sum + q.points, 0);
    const earnedPoints = answers.reduce((sum, a) => sum + a.pointsEarned, 0);
    const correctAnswers = answers.filter(a => a.isCorrect).length;

    const percentageScore = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const calculatedRating = this.calculateRating(percentageScore, categoryQuestions);

    return {
      category,
      totalQuestions: answers.length,
      correctAnswers,
      totalPoints,
      earnedPoints,
      percentageScore,
      calculatedRating,
      answers
    };
  }

  /**
   * Calculate skill rating (1-5) based on performance and question difficulty
   */
  private calculateRating(
    percentageScore: number,
    questions: AssessmentQuestion[]
  ): number {
    // Weight the score by question difficulty
    const avgDifficulty = questions.reduce((sum, q) => sum + q.difficulty, 0) / questions.length;
    
    // Base rating on percentage score
    let rating: number;
    if (percentageScore >= 90) {
      rating = 5;
    } else if (percentageScore >= 75) {
      rating = 4;
    } else if (percentageScore >= 60) {
      rating = 3;
    } else if (percentageScore >= 40) {
      rating = 2;
    } else {
      rating = 1;
    }

    // Adjust based on difficulty (harder questions deserve more credit)
    if (avgDifficulty >= DifficultyLevel.ADVANCED && percentageScore >= 50) {
      rating = Math.min(5, rating + 1);
    } else if (avgDifficulty <= DifficultyLevel.BEGINNER && percentageScore < 80) {
      rating = Math.max(1, rating - 1);
    }

    return rating;
  }

  /**
   * Calculate overall score across all sections
   */
  private calculateOverallScore(sections: SectionResult[]): number {
    if (sections.length === 0) return 0;
    
    const totalEarned = sections.reduce((sum, s) => sum + s.earnedPoints, 0);
    const totalPossible = sections.reduce((sum, s) => sum + s.totalPoints, 0);
    
    return totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 0;
  }

  /**
   * Generate recommendations based on assessment results
   */
  private generateRecommendations(sections: SectionResult[]): string[] {
    const recommendations: string[] = [];
    
    // Sort sections by rating to identify weakest areas
    const sortedSections = [...sections].sort((a, b) => a.calculatedRating - b.calculatedRating);
    
    for (const section of sortedSections) {
      const categoryName = this.getCategoryDisplayName(section.category);
      
      if (section.calculatedRating <= 2) {
        recommendations.push(
          `Focus on ${categoryName} fundamentals - start with beginner lessons and practice games.`
        );
      } else if (section.calculatedRating === 3) {
        recommendations.push(
          `Build on your ${categoryName} skills with intermediate content and targeted practice.`
        );
      } else if (section.calculatedRating === 4) {
        recommendations.push(
          `Challenge yourself with advanced ${categoryName} techniques to reach mastery.`
        );
      }
    }

    // Add overall recommendation
    const avgRating = sections.reduce((sum, s) => sum + s.calculatedRating, 0) / sections.length;
    if (avgRating >= 4) {
      recommendations.unshift('Great overall performance! Focus on refining your weakest areas.');
    } else if (avgRating >= 2.5) {
      recommendations.unshift('Solid foundation! Your personalized plan will help strengthen key areas.');
    } else {
      recommendations.unshift('Welcome to your learning journey! We\'ll build your skills step by step.');
    }

    return recommendations;
  }

  /**
   * Get display name for a skill category
   */
  getCategoryDisplayName(category: SkillCategory): string {
    const names: Record<SkillCategory, string> = {
      [SkillCategory.FREQUENCY_FINDER]: 'Frequency Finder',
      [SkillCategory.EQ_SKILL]: 'EQ Skills',
      [SkillCategory.BALANCING]: 'Mix Balancing',
      [SkillCategory.COMPRESSION]: 'Compression',
      [SkillCategory.SONG_STRUCTURE]: 'Song Structure'
    };
    return names[category];
  }
}
