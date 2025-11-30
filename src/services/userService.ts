import { v4 as uuidv4 } from 'uuid';
import {
  User,
  SkillRating,
  LearningPlan,
  UserDashboard,
  SkillCategory,
  AssessmentResult
} from '../types';
import { AITeacherService } from './aiTeacherService';
import { getContentById } from '../models/learningContent';

/**
 * In-memory storage for users (would be replaced with database in production)
 */
const userStore = new Map<string, User>();
const learningPlanStore = new Map<string, LearningPlan>();
const assessmentResultStore = new Map<string, AssessmentResult[]>();

/**
 * Service for managing user data and progress
 */
export class UserService {
  private aiTeacher: AITeacherService;

  constructor() {
    this.aiTeacher = new AITeacherService();
  }

  /**
   * Create a new user
   */
  createUser(email: string, displayName: string): User {
    const user: User = {
      id: uuidv4(),
      email,
      displayName,
      createdAt: new Date(),
      lastActiveAt: new Date(),
      hasCompletedInitialAssessment: false,
      skillRatings: []
    };

    userStore.set(user.id, user);
    assessmentResultStore.set(user.id, []);
    
    return user;
  }

  /**
   * Get user by ID
   */
  getUserById(userId: string): User | undefined {
    return userStore.get(userId);
  }

  /**
   * Update user after completing initial assessment
   */
  completeInitialAssessment(
    userId: string,
    assessmentResult: AssessmentResult
  ): { user: User; learningPlan: LearningPlan } | undefined {
    const user = userStore.get(userId);
    if (!user) return undefined;

    // Generate skill ratings from assessment
    const skillRatings = this.aiTeacher.generateSkillRatings(assessmentResult);

    // Create personalized learning plan
    const learningPlan = this.aiTeacher.createLearningPlan(userId, skillRatings);

    // Update user
    const updatedUser: User = {
      ...user,
      hasCompletedInitialAssessment: true,
      skillRatings,
      currentLearningPlanId: learningPlan.id,
      lastActiveAt: new Date()
    };

    userStore.set(userId, updatedUser);
    learningPlanStore.set(learningPlan.id, learningPlan);
    
    // Store assessment result
    const userAssessments = assessmentResultStore.get(userId) ?? [];
    userAssessments.push(assessmentResult);
    assessmentResultStore.set(userId, userAssessments);

    return { user: updatedUser, learningPlan };
  }

  /**
   * Get user's current learning plan
   */
  getLearningPlan(userId: string): LearningPlan | undefined {
    const user = userStore.get(userId);
    if (!user?.currentLearningPlanId) return undefined;
    
    return learningPlanStore.get(user.currentLearningPlanId);
  }

  /**
   * Update user progress after completing content
   */
  updateProgress(
    userId: string,
    contentId: string,
    score: number
  ): { user: User; learningPlan: LearningPlan } | undefined {
    const user = userStore.get(userId);
    if (!user?.currentLearningPlanId) return undefined;

    const plan = learningPlanStore.get(user.currentLearningPlanId);
    if (!plan) return undefined;

    // Get content details
    const content = getContentById(contentId);
    if (!content) return undefined;

    // Update learning plan
    const updatedPlan = this.aiTeacher.updateLearningPlan(
      plan,
      user.skillRatings,
      contentId,
      score
    );

    // Update skill rating for the category
    const ratingIndex = user.skillRatings.findIndex(
      r => r.category === content.category
    );
    
    if (ratingIndex >= 0) {
      const updatedRating = this.aiTeacher.updateSkillRating(
        user.skillRatings[ratingIndex],
        content.contentType,
        score,
        content.difficulty
      );
      
      user.skillRatings[ratingIndex] = updatedRating;
    }

    // Update stores
    const updatedUser: User = {
      ...user,
      lastActiveAt: new Date()
    };

    userStore.set(userId, updatedUser);
    learningPlanStore.set(updatedPlan.id, updatedPlan);

    return { user: updatedUser, learningPlan: updatedPlan };
  }

  /**
   * Get user dashboard data
   */
  getDashboard(userId: string): UserDashboard | undefined {
    const user = userStore.get(userId);
    if (!user) return undefined;

    const plan = user.currentLearningPlanId 
      ? learningPlanStore.get(user.currentLearningPlanId)
      : undefined;

    // Build skill ratings display
    const skillRatings = user.skillRatings.map(rating => ({
      category: rating.category,
      categoryName: this.getCategoryDisplayName(rating.category),
      rating: Math.round(rating.rating * 10) / 10,
      maxRating: 5,
      trend: this.aiTeacher.getSkillTrend(rating)
    }));

    // Build current plan info
    let currentPlan: UserDashboard['currentPlan'];
    if (plan) {
      const nextItems = this.aiTeacher.getNextRecommendations(plan, 3);
      currentPlan = {
        id: plan.id,
        progress: this.aiTeacher.calculatePlanProgress(plan),
        currentItem: nextItems[0],
        nextItems: nextItems.slice(1)
      };
    }

    // Build recent activity
    const assessments = assessmentResultStore.get(userId) ?? [];
    const recentActivity = this.buildRecentActivity(assessments, plan);

    // Generate recommendations
    const recommendations = this.generateDashboardRecommendations(user, plan);

    return {
      user,
      skillRatings,
      currentPlan,
      recentActivity,
      recommendations
    };
  }

  /**
   * Build recent activity list
   */
  private buildRecentActivity(
    assessments: AssessmentResult[],
    plan?: LearningPlan
  ): Array<{ date: Date; activity: string; score?: number }> {
    const activity: Array<{ date: Date; activity: string; score?: number }> = [];

    // Add assessments
    for (const assessment of assessments) {
      activity.push({
        date: assessment.completedAt,
        activity: 'Completed initial skill assessment',
        score: assessment.overallScore
      });
    }

    // Add completed plan items
    if (plan) {
      for (const item of plan.items) {
        if (item.completedAt) {
          const content = getContentById(item.contentId);
          activity.push({
            date: item.completedAt,
            activity: `Completed: ${content?.title ?? 'Unknown content'}`,
            score: item.score
          });
        }
      }
    }

    // Sort by date descending and return last 10
    return activity
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);
  }

  /**
   * Generate dashboard recommendations
   */
  private generateDashboardRecommendations(
    user: User,
    plan?: LearningPlan
  ): string[] {
    const recommendations: string[] = [];

    if (!user.hasCompletedInitialAssessment) {
      recommendations.push('Complete your initial assessment to get a personalized learning plan!');
      return recommendations;
    }

    // Find weakest skill
    const weakestSkill = [...user.skillRatings]
      .sort((a, b) => a.rating - b.rating)[0];
    
    if (weakestSkill && weakestSkill.rating <= 3) {
      recommendations.push(
        `Focus on improving your ${this.getCategoryDisplayName(weakestSkill.category)} skills (${weakestSkill.rating}/5)`
      );
    }

    // Add progress-based recommendations
    if (plan) {
      const progress = this.aiTeacher.calculatePlanProgress(plan);
      if (progress < 25) {
        recommendations.push('You\'re just getting started! Complete a few lessons to build momentum.');
      } else if (progress < 75) {
        recommendations.push('Great progress! Keep up the consistent practice.');
      } else {
        recommendations.push('Almost there! Finish your current plan to unlock advanced content.');
      }
    }

    // Add skill trend recommendations
    for (const rating of user.skillRatings) {
      const trend = this.aiTeacher.getSkillTrend(rating);
      if (trend === 'improving') {
        recommendations.push(
          `Your ${this.getCategoryDisplayName(rating.category)} skills are improving - great job!`
        );
        break;
      }
    }

    return recommendations.slice(0, 5);
  }

  /**
   * Get display name for skill category
   */
  private getCategoryDisplayName(category: SkillCategory): string {
    const names: Record<SkillCategory, string> = {
      [SkillCategory.FREQUENCY_FINDER]: 'Frequency Finder',
      [SkillCategory.EQ_SKILL]: 'EQ Skills',
      [SkillCategory.BALANCING]: 'Mix Balancing',
      [SkillCategory.COMPRESSION]: 'Compression',
      [SkillCategory.SONG_STRUCTURE]: 'Song Structure'
    };
    return names[category];
  }

  /**
   * Get assessment history for a user
   */
  getAssessmentHistory(userId: string): AssessmentResult[] {
    return assessmentResultStore.get(userId) ?? [];
  }

  /**
   * Get all users (for admin purposes)
   */
  getAllUsers(): User[] {
    return Array.from(userStore.values());
  }

  /**
   * Clear all data (for testing)
   */
  clearAll(): void {
    userStore.clear();
    learningPlanStore.clear();
    assessmentResultStore.clear();
  }
}
