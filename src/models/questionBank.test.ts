import { 
  assessmentQuestionBank,
  getQuestionsByCategory,
  getAssessmentQuestions
} from './questionBank';
import { SkillCategory } from '../types';

describe('questionBank', () => {
  describe('getQuestionsByCategory', () => {
    it('should return questions for valid category', () => {
      const freqQuestions = getQuestionsByCategory(SkillCategory.FREQUENCY_FINDER);
      
      expect(freqQuestions.length).toBeGreaterThan(0);
      expect(freqQuestions.every(q => q.category === SkillCategory.FREQUENCY_FINDER)).toBe(true);
    });

    it('should return questions for all categories', () => {
      for (const category of Object.values(SkillCategory)) {
        const questions = getQuestionsByCategory(category);
        expect(questions.length).toBeGreaterThan(0);
      }
    });

    it('should return consistent results across multiple calls (index is built once)', () => {
      const questions1 = getQuestionsByCategory(SkillCategory.EQ_SKILL);
      const questions2 = getQuestionsByCategory(SkillCategory.EQ_SKILL);
      
      expect(questions1).toBe(questions2); // Same array reference from index
    });
  });

  describe('getAssessmentQuestions', () => {
    it('should return questions from all categories', () => {
      const questions = getAssessmentQuestions(3);
      
      const categories = new Set(questions.map(q => q.category));
      expect(categories.size).toBe(5);
    });

    it('should respect questionsPerCategory limit', () => {
      const questions = getAssessmentQuestions(2);
      
      // Should have up to 2 questions per category
      const categoryCounts = new Map<SkillCategory, number>();
      for (const q of questions) {
        categoryCounts.set(q.category, (categoryCounts.get(q.category) ?? 0) + 1);
      }
      
      for (const count of categoryCounts.values()) {
        expect(count).toBeLessThanOrEqual(2);
      }
    });

    it('should include questions with varying difficulty levels', () => {
      const questions = getAssessmentQuestions(5);
      
      const difficulties = new Set(questions.map(q => q.difficulty));
      expect(difficulties.size).toBeGreaterThan(1);
    });
  });

  describe('assessmentQuestionBank', () => {
    it('should contain questions for all skill categories', () => {
      const categories = new Set(assessmentQuestionBank.map(q => q.category));
      
      expect(categories.size).toBe(5);
      expect(categories.has(SkillCategory.FREQUENCY_FINDER)).toBe(true);
      expect(categories.has(SkillCategory.EQ_SKILL)).toBe(true);
      expect(categories.has(SkillCategory.BALANCING)).toBe(true);
      expect(categories.has(SkillCategory.COMPRESSION)).toBe(true);
      expect(categories.has(SkillCategory.SONG_STRUCTURE)).toBe(true);
    });

    it('should have unique question IDs', () => {
      const ids = assessmentQuestionBank.map(q => q.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid point values', () => {
      for (const question of assessmentQuestionBank) {
        expect(question.points).toBeGreaterThan(0);
      }
    });

    it('should have correct answers defined', () => {
      for (const question of assessmentQuestionBank) {
        expect(question.correctAnswer).toBeDefined();
        if (Array.isArray(question.correctAnswer)) {
          expect(question.correctAnswer.length).toBeGreaterThan(0);
        } else {
          expect(question.correctAnswer.length).toBeGreaterThan(0);
        }
      }
    });
  });
});
