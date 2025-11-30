import { AssessmentService } from './assessmentService';
import { SkillCategory, DifficultyLevel } from '../types';

describe('AssessmentService', () => {
  let assessmentService: AssessmentService;

  beforeEach(() => {
    assessmentService = new AssessmentService();
  });

  describe('generateAssessment', () => {
    it('should generate an assessment with questions from all categories', () => {
      const { assessmentId, questions } = assessmentService.generateAssessment(3);

      expect(assessmentId).toBeDefined();
      expect(questions.length).toBeGreaterThan(0);

      // Check that all categories are represented
      const categories = new Set(questions.map(q => q.category));
      expect(categories.size).toBe(5);
      expect(categories.has(SkillCategory.FREQUENCY_FINDER)).toBe(true);
      expect(categories.has(SkillCategory.EQ_SKILL)).toBe(true);
      expect(categories.has(SkillCategory.BALANCING)).toBe(true);
      expect(categories.has(SkillCategory.COMPRESSION)).toBe(true);
      expect(categories.has(SkillCategory.SONG_STRUCTURE)).toBe(true);
    });

    it('should generate unique assessment IDs', () => {
      const assessment1 = assessmentService.generateAssessment();
      const assessment2 = assessmentService.generateAssessment();

      expect(assessment1.assessmentId).not.toBe(assessment2.assessmentId);
    });

    it('should include questions with varying difficulty levels', () => {
      const { questions } = assessmentService.generateAssessment(5);
      
      const difficulties = new Set(questions.map(q => q.difficulty));
      expect(difficulties.size).toBeGreaterThan(1);
    });
  });

  describe('scoreAssessment', () => {
    it('should score correct answers and calculate ratings', () => {
      const { assessmentId, questions } = assessmentService.generateAssessment(3);
      
      // Create perfect answers
      const answers = new Map<string, string | string[]>();
      for (const q of questions) {
        if (Array.isArray(q.correctAnswer)) {
          answers.set(q.id, q.correctAnswer);
        } else {
          answers.set(q.id, q.correctAnswer);
        }
      }

      const result = assessmentService.scoreAssessment(
        assessmentId,
        'test-user-id',
        answers,
        questions,
        new Date()
      );

      expect(result.id).toBe(assessmentId);
      expect(result.userId).toBe('test-user-id');
      expect(result.overallScore).toBeGreaterThan(0);
      expect(result.sections.length).toBe(5);
      
      // All sections should have high ratings with perfect answers
      for (const section of result.sections) {
        expect(section.calculatedRating).toBeGreaterThanOrEqual(3);
      }
    });

    it('should score incorrect answers with low ratings', () => {
      const { assessmentId, questions } = assessmentService.generateAssessment(3);
      
      // Create wrong answers
      const answers = new Map<string, string | string[]>();
      for (const q of questions) {
        answers.set(q.id, 'wrong-answer');
      }

      const result = assessmentService.scoreAssessment(
        assessmentId,
        'test-user-id',
        answers,
        questions,
        new Date()
      );

      // Low scores should result in low ratings
      expect(result.overallScore).toBe(0);
      for (const section of result.sections) {
        expect(section.calculatedRating).toBeLessThanOrEqual(2);
      }
    });

    it('should generate recommendations based on results', () => {
      const { assessmentId, questions } = assessmentService.generateAssessment(3);
      const answers = new Map<string, string | string[]>();
      
      const result = assessmentService.scoreAssessment(
        assessmentId,
        'test-user-id',
        answers,
        questions,
        new Date()
      );

      expect(result.recommendations).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('getCategoryDisplayName', () => {
    it('should return correct display names for all categories', () => {
      expect(assessmentService.getCategoryDisplayName(SkillCategory.FREQUENCY_FINDER))
        .toBe('Frequency Finder');
      expect(assessmentService.getCategoryDisplayName(SkillCategory.EQ_SKILL))
        .toBe('EQ Skills');
      expect(assessmentService.getCategoryDisplayName(SkillCategory.BALANCING))
        .toBe('Mix Balancing');
      expect(assessmentService.getCategoryDisplayName(SkillCategory.COMPRESSION))
        .toBe('Compression');
      expect(assessmentService.getCategoryDisplayName(SkillCategory.SONG_STRUCTURE))
        .toBe('Song Structure');
    });
  });
});
