import { AITeacherService } from './aiTeacherService';
import { 
  AssessmentResult, 
  SkillRating, 
  SkillCategory, 
  DifficultyLevel, 
  ContentType,
  ProgressStatus 
} from '../types';

describe('AITeacherService', () => {
  let aiTeacher: AITeacherService;

  beforeEach(() => {
    aiTeacher = new AITeacherService();
  });

  describe('generateSkillRatings', () => {
    it('should generate skill ratings from assessment results', () => {
      const assessmentResult: AssessmentResult = {
        id: 'test-assessment',
        userId: 'test-user',
        startedAt: new Date(),
        completedAt: new Date(),
        overallScore: 75,
        recommendations: [],
        sections: [
          {
            category: SkillCategory.FREQUENCY_FINDER,
            totalQuestions: 3,
            correctAnswers: 2,
            totalPoints: 30,
            earnedPoints: 20,
            percentageScore: 66,
            calculatedRating: 3,
            answers: []
          },
          {
            category: SkillCategory.EQ_SKILL,
            totalQuestions: 3,
            correctAnswers: 3,
            totalPoints: 30,
            earnedPoints: 30,
            percentageScore: 100,
            calculatedRating: 5,
            answers: []
          }
        ]
      };

      const ratings = aiTeacher.generateSkillRatings(assessmentResult);

      expect(ratings.length).toBe(2);
      expect(ratings[0].category).toBe(SkillCategory.FREQUENCY_FINDER);
      expect(ratings[0].rating).toBe(3);
      expect(ratings[1].category).toBe(SkillCategory.EQ_SKILL);
      expect(ratings[1].rating).toBe(5);
    });
  });

  describe('createLearningPlan', () => {
    it('should create a learning plan with focus on weak areas', () => {
      const skillRatings: SkillRating[] = [
        {
          category: SkillCategory.FREQUENCY_FINDER,
          rating: 2,
          lastAssessed: new Date(),
          history: []
        },
        {
          category: SkillCategory.EQ_SKILL,
          rating: 4,
          lastAssessed: new Date(),
          history: []
        },
        {
          category: SkillCategory.BALANCING,
          rating: 3,
          lastAssessed: new Date(),
          history: []
        },
        {
          category: SkillCategory.COMPRESSION,
          rating: 1,
          lastAssessed: new Date(),
          history: []
        },
        {
          category: SkillCategory.SONG_STRUCTURE,
          rating: 4,
          lastAssessed: new Date(),
          history: []
        }
      ];

      const plan = aiTeacher.createLearningPlan('test-user', skillRatings);

      expect(plan.userId).toBe('test-user');
      expect(plan.id).toBeDefined();
      expect(plan.items.length).toBeGreaterThan(0);
      expect(plan.isActive).toBe(true);
      expect(plan.currentItemIndex).toBe(0);
      
      // Focus areas should include weak skills
      expect(plan.focusAreas).toContain(SkillCategory.COMPRESSION);
      expect(plan.focusAreas).toContain(SkillCategory.FREQUENCY_FINDER);
    });

    it('should create plan even when all skills are strong', () => {
      const skillRatings: SkillRating[] = Object.values(SkillCategory).map(category => ({
        category,
        rating: 4,
        lastAssessed: new Date(),
        history: []
      }));

      const plan = aiTeacher.createLearningPlan('test-user', skillRatings);

      expect(plan.items.length).toBeGreaterThan(0);
      expect(plan.focusAreas.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('updateSkillRating', () => {
    it('should increase rating for high scores on challenging content', () => {
      const currentRating: SkillRating = {
        category: SkillCategory.FREQUENCY_FINDER,
        rating: 3,
        lastAssessed: new Date(),
        history: []
      };

      const updated = aiTeacher.updateSkillRating(
        currentRating,
        ContentType.QUIZ,
        95,
        DifficultyLevel.ADVANCED
      );

      expect(updated.rating).toBeGreaterThan(currentRating.rating);
      expect(updated.history.length).toBe(1);
    });

    it('should decrease rating for low scores on appropriate content', () => {
      const currentRating: SkillRating = {
        category: SkillCategory.FREQUENCY_FINDER,
        rating: 3,
        lastAssessed: new Date(),
        history: []
      };

      const updated = aiTeacher.updateSkillRating(
        currentRating,
        ContentType.QUIZ,
        30,
        DifficultyLevel.INTERMEDIATE
      );

      expect(updated.rating).toBeLessThan(currentRating.rating);
    });

    it('should not exceed rating bounds (1-5)', () => {
      const highRating: SkillRating = {
        category: SkillCategory.FREQUENCY_FINDER,
        rating: 5,
        lastAssessed: new Date(),
        history: []
      };

      const updated = aiTeacher.updateSkillRating(
        highRating,
        ContentType.QUIZ,
        100,
        DifficultyLevel.EXPERT
      );

      expect(updated.rating).toBeLessThanOrEqual(5);
    });
  });

  describe('getSkillTrend', () => {
    it('should return improving when rating is increasing', () => {
      const rating: SkillRating = {
        category: SkillCategory.FREQUENCY_FINDER,
        rating: 4,
        lastAssessed: new Date(),
        history: [
          { rating: 2, assessedAt: new Date(), source: 'initial_test' },
          { rating: 3, assessedAt: new Date(), source: 'quiz' },
          { rating: 4, assessedAt: new Date(), source: 'quiz' }
        ]
      };

      expect(aiTeacher.getSkillTrend(rating)).toBe('improving');
    });

    it('should return declining when rating is decreasing', () => {
      const rating: SkillRating = {
        category: SkillCategory.FREQUENCY_FINDER,
        rating: 2,
        lastAssessed: new Date(),
        history: [
          { rating: 4, assessedAt: new Date(), source: 'initial_test' },
          { rating: 3, assessedAt: new Date(), source: 'quiz' },
          { rating: 2, assessedAt: new Date(), source: 'quiz' }
        ]
      };

      expect(aiTeacher.getSkillTrend(rating)).toBe('declining');
    });

    it('should return stable when rating is not changing significantly', () => {
      const rating: SkillRating = {
        category: SkillCategory.FREQUENCY_FINDER,
        rating: 3,
        lastAssessed: new Date(),
        history: [
          { rating: 3, assessedAt: new Date(), source: 'initial_test' },
          { rating: 3.1, assessedAt: new Date(), source: 'quiz' },
          { rating: 3.2, assessedAt: new Date(), source: 'quiz' }
        ]
      };

      expect(aiTeacher.getSkillTrend(rating)).toBe('stable');
    });

    it('should return stable when history is too short', () => {
      const rating: SkillRating = {
        category: SkillCategory.FREQUENCY_FINDER,
        rating: 3,
        lastAssessed: new Date(),
        history: [{ rating: 3, assessedAt: new Date(), source: 'initial_test' }]
      };

      expect(aiTeacher.getSkillTrend(rating)).toBe('stable');
    });
  });

  describe('calculatePlanProgress', () => {
    it('should calculate correct progress percentage', () => {
      const plan = {
        id: 'test-plan',
        userId: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          { id: '1', contentId: 'c1', order: 0, status: ProgressStatus.COMPLETED, attempts: 1 },
          { id: '2', contentId: 'c2', order: 1, status: ProgressStatus.COMPLETED, attempts: 1 },
          { id: '3', contentId: 'c3', order: 2, status: ProgressStatus.NOT_STARTED, attempts: 0 },
          { id: '4', contentId: 'c4', order: 3, status: ProgressStatus.NOT_STARTED, attempts: 0 }
        ],
        focusAreas: [],
        currentItemIndex: 2,
        isActive: true
      };

      expect(aiTeacher.calculatePlanProgress(plan)).toBe(50);
    });

    it('should return 0 for empty plan', () => {
      const plan = {
        id: 'test-plan',
        userId: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [],
        focusAreas: [],
        currentItemIndex: 0,
        isActive: true
      };

      expect(aiTeacher.calculatePlanProgress(plan)).toBe(0);
    });
  });
});
