import { v4 as uuidv4 } from 'uuid';
import {
  AssessmentResult,
  LearningPlan,
  LearningPlanItem,
  LearningContent,
  SkillRating,
  SkillCategory,
  DifficultyLevel,
  ContentType,
  ProgressStatus
} from '../types';
import { 
  learningContentLibrary, 
  getContentByCategory, 
  getContentForSkillLevel,
  getContentById 
} from '../models/learningContent';

/**
 * AI Teacher Service
 * Analyzes user performance and creates adaptive learning plans
 */
export class AITeacherService {
  /**
   * Generate skill ratings from assessment results
   */
  generateSkillRatings(result: AssessmentResult): SkillRating[] {
    return result.sections.map(section => ({
      category: section.category,
      rating: section.calculatedRating,
      lastAssessed: result.completedAt,
      history: [{
        rating: section.calculatedRating,
        assessedAt: result.completedAt,
        source: 'initial_test'
      }]
    }));
  }

  /**
   * Create an adaptive learning plan based on assessment results
   * The plan prioritizes weak areas while maintaining engagement with stronger skills
   */
  createLearningPlan(
    userId: string,
    skillRatings: SkillRating[]
  ): LearningPlan {
    // Sort categories by rating (weakest first)
    const sortedRatings = [...skillRatings].sort((a, b) => a.rating - b.rating);
    
    // Identify focus areas (rating 3 or below)
    const focusAreas = sortedRatings
      .filter(r => r.rating <= 3)
      .map(r => r.category);

    // If all skills are strong, focus on advancing the relatively weaker ones
    const effectiveFocusAreas = focusAreas.length > 0 
      ? focusAreas 
      : sortedRatings.slice(0, 2).map(r => r.category);

    // Generate learning plan items
    const items: LearningPlanItem[] = [];
    let orderIndex = 0;

    // First pass: Add foundational content for weak areas
    for (const rating of sortedRatings) {
      const maxDifficulty = this.getMaxDifficultyForRating(rating.rating);
      const categoryContent = this.getProgressionForCategory(
        rating.category,
        maxDifficulty,
        effectiveFocusAreas.includes(rating.category)
      );

      for (const content of categoryContent) {
        items.push({
          id: uuidv4(),
          contentId: content.id,
          order: orderIndex++,
          status: ProgressStatus.NOT_STARTED,
          attempts: 0
        });
      }
    }

    // Re-sort items by optimal learning order (lessons before games before quizzes)
    const sortedItems = this.optimizeLearningOrder(items);

    return {
      id: uuidv4(),
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: sortedItems,
      focusAreas: effectiveFocusAreas,
      currentItemIndex: 0,
      isActive: true
    };
  }

  /**
   * Determine maximum difficulty level based on skill rating
   */
  private getMaxDifficultyForRating(rating: number): DifficultyLevel {
    if (rating <= 1) return DifficultyLevel.BEGINNER;
    if (rating <= 2) return DifficultyLevel.INTERMEDIATE;
    if (rating <= 3) return DifficultyLevel.ADVANCED;
    if (rating <= 4) return DifficultyLevel.EXPERT;
    return DifficultyLevel.MASTER;
  }

  /**
   * Get learning content progression for a category
   */
  private getProgressionForCategory(
    category: SkillCategory,
    maxDifficulty: DifficultyLevel,
    isFocusArea: boolean
  ): LearningContent[] {
    const content = getContentForSkillLevel(category, maxDifficulty);
    
    if (content.length === 0) {
      return [];
    }

    // For focus areas, include more content
    // For non-focus areas, include only key items
    const lessons = content.filter(c => c.contentType === ContentType.LESSON);
    const games = content.filter(c => c.contentType === ContentType.MINI_GAME);
    const quizzes = content.filter(c => c.contentType === ContentType.QUIZ);

    const result: LearningContent[] = [];

    if (isFocusArea) {
      // Include all lessons
      result.push(...lessons);
      // Include all games
      result.push(...games);
      // Include all quizzes
      result.push(...quizzes);
    } else {
      // Include first lesson and one game/quiz for variety
      if (lessons.length > 0) result.push(lessons[0]);
      if (games.length > 0) result.push(games[0]);
      if (quizzes.length > 0) result.push(quizzes[0]);
    }

    return result;
  }

  /**
   * Optimize learning order: lessons → games → quizzes, respecting prerequisites
   */
  private optimizeLearningOrder(items: LearningPlanItem[]): LearningPlanItem[] {
    const contentMap = new Map<string, LearningContent>();
    for (const item of items) {
      const content = getContentById(item.contentId);
      if (content) {
        contentMap.set(item.contentId, content);
      }
    }

    // Sort by: content type priority, then difficulty, then original order
    const typePriority: Record<ContentType, number> = {
      [ContentType.LESSON]: 1,
      [ContentType.PRACTICE]: 2,
      [ContentType.MINI_GAME]: 3,
      [ContentType.QUIZ]: 4
    };

    const sorted = [...items].sort((a, b) => {
      const contentA = contentMap.get(a.contentId);
      const contentB = contentMap.get(b.contentId);

      if (!contentA || !contentB) return 0;

      // First by type
      const typeCompare = typePriority[contentA.contentType] - typePriority[contentB.contentType];
      if (typeCompare !== 0) return typeCompare;

      // Then by difficulty
      const diffCompare = contentA.difficulty - contentB.difficulty;
      if (diffCompare !== 0) return diffCompare;

      // Finally by original order
      return a.order - b.order;
    });

    // Re-assign order numbers
    return sorted.map((item, index) => ({
      ...item,
      order: index
    }));
  }

  /**
   * Update learning plan based on new quiz/game results
   */
  updateLearningPlan(
    plan: LearningPlan,
    skillRatings: SkillRating[],
    completedContentId: string,
    score: number
  ): LearningPlan {
    const updatedItems = [...plan.items];
    const itemIndex = updatedItems.findIndex(i => i.contentId === completedContentId);
    
    if (itemIndex === -1) {
      return plan;
    }

    // Update the completed item
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      status: score >= 70 ? ProgressStatus.COMPLETED : ProgressStatus.IN_PROGRESS,
      completedAt: new Date(),
      score,
      attempts: updatedItems[itemIndex].attempts + 1
    };

    // If score is low, consider adding remedial content
    if (score < 50) {
      const content = getContentById(completedContentId);
      if (content) {
        const remedialContent = this.getRemedialContent(content);
        if (remedialContent.length > 0) {
          const newItems = remedialContent.map((c, idx) => ({
            id: uuidv4(),
            contentId: c.id,
            order: itemIndex + idx + 1,
            status: ProgressStatus.NOT_STARTED,
            attempts: 0
          }));
          
          // Insert remedial content after current item
          updatedItems.splice(itemIndex + 1, 0, ...newItems);
        }
      }
    }

    // Find next item
    const nextIndex = updatedItems.findIndex(
      i => i.status === ProgressStatus.NOT_STARTED || i.status === ProgressStatus.IN_PROGRESS
    );

    return {
      ...plan,
      items: updatedItems,
      currentItemIndex: nextIndex >= 0 ? nextIndex : plan.items.length,
      updatedAt: new Date()
    };
  }

  /**
   * Get remedial content for struggling users
   */
  private getRemedialContent(content: LearningContent): LearningContent[] {
    // Find prerequisites or lower difficulty content in same category
    const categoryContent = getContentByCategory(content.category);
    
    return categoryContent.filter(c => 
      c.difficulty < content.difficulty &&
      c.contentType === ContentType.LESSON &&
      !content.prerequisites?.includes(c.id)
    ).slice(0, 2);
  }

  /**
   * Update skill rating after completing content
   */
  updateSkillRating(
    currentRating: SkillRating,
    contentType: ContentType,
    score: number,
    contentDifficulty: DifficultyLevel
  ): SkillRating {
    // Calculate rating adjustment based on performance
    let adjustment = 0;
    
    if (score >= 90 && contentDifficulty >= currentRating.rating) {
      adjustment = 0.5; // Strong performance on challenging content
    } else if (score >= 70 && contentDifficulty >= currentRating.rating) {
      adjustment = 0.25; // Good performance
    } else if (score < 50 && contentDifficulty <= currentRating.rating) {
      adjustment = -0.25; // Struggling with appropriate content
    }

    // Quizzes have more weight than games
    if (contentType === ContentType.QUIZ) {
      adjustment *= 1.5;
    }

    const newRating = Math.max(1, Math.min(5, currentRating.rating + adjustment));

    return {
      ...currentRating,
      rating: newRating,
      lastAssessed: new Date(),
      history: [
        ...currentRating.history,
        {
          rating: newRating,
          assessedAt: new Date(),
          source: contentType.toLowerCase()
        }
      ]
    };
  }

  /**
   * Get next recommended content for a user
   */
  getNextRecommendations(
    plan: LearningPlan,
    count: number = 3
  ): LearningContent[] {
    const recommendations: LearningContent[] = [];
    
    for (const item of plan.items) {
      if (item.status === ProgressStatus.NOT_STARTED || 
          item.status === ProgressStatus.IN_PROGRESS) {
        const content = getContentById(item.contentId);
        if (content) {
          recommendations.push(content);
          if (recommendations.length >= count) break;
        }
      }
    }

    return recommendations;
  }

  /**
   * Calculate plan progress percentage
   */
  calculatePlanProgress(plan: LearningPlan): number {
    if (plan.items.length === 0) return 0;
    
    const completed = plan.items.filter(
      i => i.status === ProgressStatus.COMPLETED || i.status === ProgressStatus.MASTERED
    ).length;
    
    return (completed / plan.items.length) * 100;
  }

  /**
   * Determine skill trend based on history
   */
  getSkillTrend(rating: SkillRating): 'improving' | 'stable' | 'declining' {
    if (rating.history.length < 2) return 'stable';
    
    const recent = rating.history.slice(-3);
    const first = recent[0].rating;
    const last = recent[recent.length - 1].rating;
    
    if (last - first >= 0.5) return 'improving';
    if (first - last >= 0.5) return 'declining';
    return 'stable';
  }
}
