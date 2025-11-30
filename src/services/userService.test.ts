import { UserService } from './userService';
import { AssessmentResult, SkillCategory } from '../types';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    userService.clearAll();
  });

  describe('createUser', () => {
    it('should create a new user with correct properties', () => {
      const user = userService.createUser('test@example.com', 'Test User');

      expect(user.id).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.displayName).toBe('Test User');
      expect(user.hasCompletedInitialAssessment).toBe(false);
      expect(user.skillRatings).toEqual([]);
      expect(user.createdAt).toBeDefined();
    });

    it('should create users with unique IDs', () => {
      const user1 = userService.createUser('user1@example.com', 'User 1');
      const user2 = userService.createUser('user2@example.com', 'User 2');

      expect(user1.id).not.toBe(user2.id);
    });
  });

  describe('getUserById', () => {
    it('should return user when found', () => {
      const created = userService.createUser('test@example.com', 'Test User');
      const found = userService.getUserById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return undefined for non-existent user', () => {
      const found = userService.getUserById('non-existent-id');
      expect(found).toBeUndefined();
    });
  });

  describe('completeInitialAssessment', () => {
    it('should update user with assessment results and create learning plan', () => {
      const user = userService.createUser('test@example.com', 'Test User');
      
      const assessmentResult: AssessmentResult = {
        id: 'test-assessment',
        userId: user.id,
        startedAt: new Date(),
        completedAt: new Date(),
        overallScore: 65,
        recommendations: ['Focus on weak areas'],
        sections: Object.values(SkillCategory).map(category => ({
          category,
          totalQuestions: 3,
          correctAnswers: 2,
          totalPoints: 30,
          earnedPoints: 20,
          percentageScore: 66,
          calculatedRating: 3,
          answers: []
        }))
      };

      const result = userService.completeInitialAssessment(user.id, assessmentResult);

      expect(result).toBeDefined();
      expect(result?.user.hasCompletedInitialAssessment).toBe(true);
      expect(result?.user.skillRatings.length).toBe(5);
      expect(result?.learningPlan).toBeDefined();
      expect(result?.learningPlan.items.length).toBeGreaterThan(0);
    });

    it('should return undefined for non-existent user', () => {
      const assessmentResult: AssessmentResult = {
        id: 'test-assessment',
        userId: 'non-existent',
        startedAt: new Date(),
        completedAt: new Date(),
        overallScore: 65,
        recommendations: [],
        sections: []
      };

      const result = userService.completeInitialAssessment('non-existent', assessmentResult);
      expect(result).toBeUndefined();
    });
  });

  describe('getDashboard', () => {
    it('should return dashboard data for user without assessment', () => {
      const user = userService.createUser('test@example.com', 'Test User');
      const dashboard = userService.getDashboard(user.id);

      expect(dashboard).toBeDefined();
      expect(dashboard?.user.id).toBe(user.id);
      expect(dashboard?.skillRatings).toEqual([]);
      expect(dashboard?.recommendations).toContain(
        'Complete your initial assessment to get a personalized learning plan!'
      );
    });

    it('should return dashboard data for user with completed assessment', () => {
      const user = userService.createUser('test@example.com', 'Test User');
      
      const assessmentResult: AssessmentResult = {
        id: 'test-assessment',
        userId: user.id,
        startedAt: new Date(),
        completedAt: new Date(),
        overallScore: 65,
        recommendations: [],
        sections: Object.values(SkillCategory).map(category => ({
          category,
          totalQuestions: 3,
          correctAnswers: 2,
          totalPoints: 30,
          earnedPoints: 20,
          percentageScore: 66,
          calculatedRating: 3,
          answers: []
        }))
      };

      userService.completeInitialAssessment(user.id, assessmentResult);
      const dashboard = userService.getDashboard(user.id);

      expect(dashboard).toBeDefined();
      expect(dashboard?.skillRatings.length).toBe(5);
      expect(dashboard?.currentPlan).toBeDefined();
      expect(dashboard?.recentActivity.length).toBeGreaterThan(0);
    });

    it('should return undefined for non-existent user', () => {
      const dashboard = userService.getDashboard('non-existent');
      expect(dashboard).toBeUndefined();
    });
  });

  describe('getLearningPlan', () => {
    it('should return learning plan for user with completed assessment', () => {
      const user = userService.createUser('test@example.com', 'Test User');
      
      const assessmentResult: AssessmentResult = {
        id: 'test-assessment',
        userId: user.id,
        startedAt: new Date(),
        completedAt: new Date(),
        overallScore: 65,
        recommendations: [],
        sections: Object.values(SkillCategory).map(category => ({
          category,
          totalQuestions: 3,
          correctAnswers: 2,
          totalPoints: 30,
          earnedPoints: 20,
          percentageScore: 66,
          calculatedRating: 3,
          answers: []
        }))
      };

      userService.completeInitialAssessment(user.id, assessmentResult);
      const plan = userService.getLearningPlan(user.id);

      expect(plan).toBeDefined();
      expect(plan?.userId).toBe(user.id);
      expect(plan?.items.length).toBeGreaterThan(0);
    });

    it('should return undefined for user without learning plan', () => {
      const user = userService.createUser('test@example.com', 'Test User');
      const plan = userService.getLearningPlan(user.id);

      expect(plan).toBeUndefined();
    });
  });

  describe('getAssessmentHistory', () => {
    it('should return assessment history for user', () => {
      const user = userService.createUser('test@example.com', 'Test User');
      
      const assessmentResult: AssessmentResult = {
        id: 'test-assessment',
        userId: user.id,
        startedAt: new Date(),
        completedAt: new Date(),
        overallScore: 65,
        recommendations: [],
        sections: Object.values(SkillCategory).map(category => ({
          category,
          totalQuestions: 3,
          correctAnswers: 2,
          totalPoints: 30,
          earnedPoints: 20,
          percentageScore: 66,
          calculatedRating: 3,
          answers: []
        }))
      };

      userService.completeInitialAssessment(user.id, assessmentResult);
      const history = userService.getAssessmentHistory(user.id);

      expect(history.length).toBe(1);
      expect(history[0].id).toBe('test-assessment');
    });

    it('should return empty array for user without history', () => {
      const user = userService.createUser('test@example.com', 'Test User');
      const history = userService.getAssessmentHistory(user.id);

      expect(history).toEqual([]);
    });
  });
});
