import { 
  learningContentLibrary,
  getContentById,
  getContentByCategory,
  getContentForSkillLevel,
  getContentByType,
  getContentByDifficulty
} from './learningContent';
import { SkillCategory, ContentType, DifficultyLevel } from '../types';

describe('learningContent', () => {
  describe('getContentById', () => {
    it('should return content for valid ID', () => {
      const content = getContentById('freq-lesson-basics');
      
      expect(content).toBeDefined();
      expect(content?.id).toBe('freq-lesson-basics');
      expect(content?.title).toBe('Introduction to Audio Frequencies');
    });

    it('should return undefined for invalid ID', () => {
      const content = getContentById('non-existent-id');
      expect(content).toBeUndefined();
    });

    it('should return consistent results across multiple calls (index is built once)', () => {
      const content1 = getContentById('eq-lesson-basics');
      const content2 = getContentById('eq-lesson-basics');
      
      expect(content1).toBe(content2); // Same reference - index returns cached entry
    });
  });

  describe('getContentByCategory', () => {
    it('should return all content for a category', () => {
      const freqContent = getContentByCategory(SkillCategory.FREQUENCY_FINDER);
      
      expect(freqContent.length).toBeGreaterThan(0);
      expect(freqContent.every(c => c.category === SkillCategory.FREQUENCY_FINDER)).toBe(true);
    });

    it('should return content for all categories', () => {
      for (const category of Object.values(SkillCategory)) {
        const content = getContentByCategory(category);
        expect(content.length).toBeGreaterThan(0);
      }
    });

    it('should return consistent results across multiple calls', () => {
      const content1 = getContentByCategory(SkillCategory.EQ_SKILL);
      const content2 = getContentByCategory(SkillCategory.EQ_SKILL);
      
      expect(content1).toBe(content2); // Same array reference from index
    });
  });

  describe('getContentForSkillLevel', () => {
    it('should return content at or below specified difficulty', () => {
      const content = getContentForSkillLevel(
        SkillCategory.FREQUENCY_FINDER,
        DifficultyLevel.INTERMEDIATE
      );
      
      expect(content.length).toBeGreaterThan(0);
      expect(content.every(c => c.difficulty <= DifficultyLevel.INTERMEDIATE)).toBe(true);
    });

    it('should return more content for higher difficulty levels', () => {
      const beginnerContent = getContentForSkillLevel(
        SkillCategory.EQ_SKILL,
        DifficultyLevel.BEGINNER
      );
      const expertContent = getContentForSkillLevel(
        SkillCategory.EQ_SKILL,
        DifficultyLevel.EXPERT
      );
      
      expect(expertContent.length).toBeGreaterThanOrEqual(beginnerContent.length);
    });
  });

  describe('getContentByType', () => {
    it('should return all lessons', () => {
      const lessons = getContentByType(ContentType.LESSON);
      
      expect(lessons.length).toBeGreaterThan(0);
      expect(lessons.every(c => c.contentType === ContentType.LESSON)).toBe(true);
    });

    it('should return all mini games', () => {
      const games = getContentByType(ContentType.MINI_GAME);
      
      expect(games.length).toBeGreaterThan(0);
      expect(games.every(c => c.contentType === ContentType.MINI_GAME)).toBe(true);
    });

    it('should return all quizzes', () => {
      const quizzes = getContentByType(ContentType.QUIZ);
      
      expect(quizzes.length).toBeGreaterThan(0);
      expect(quizzes.every(c => c.contentType === ContentType.QUIZ)).toBe(true);
    });

    it('should return consistent results across multiple calls (index is built once)', () => {
      const lessons1 = getContentByType(ContentType.LESSON);
      const lessons2 = getContentByType(ContentType.LESSON);
      
      expect(lessons1).toBe(lessons2); // Same array reference from index
    });
  });

  describe('getContentByDifficulty', () => {
    it('should return content for specific difficulty level', () => {
      const beginnerContent = getContentByDifficulty(DifficultyLevel.BEGINNER);
      
      expect(beginnerContent.length).toBeGreaterThan(0);
      expect(beginnerContent.every(c => c.difficulty === DifficultyLevel.BEGINNER)).toBe(true);
    });

    it('should return consistent results across multiple calls (index is built once)', () => {
      const beginner1 = getContentByDifficulty(DifficultyLevel.BEGINNER);
      const beginner2 = getContentByDifficulty(DifficultyLevel.BEGINNER);
      
      expect(beginner1).toBe(beginner2); // Same array reference from index
    });
  });

  describe('learningContentLibrary', () => {
    it('should contain all expected content categories', () => {
      const categories = new Set(learningContentLibrary.map(c => c.category));
      
      expect(categories.size).toBe(5);
      expect(categories.has(SkillCategory.FREQUENCY_FINDER)).toBe(true);
      expect(categories.has(SkillCategory.EQ_SKILL)).toBe(true);
      expect(categories.has(SkillCategory.BALANCING)).toBe(true);
      expect(categories.has(SkillCategory.COMPRESSION)).toBe(true);
      expect(categories.has(SkillCategory.SONG_STRUCTURE)).toBe(true);
    });

    it('should contain all expected content types', () => {
      const types = new Set(learningContentLibrary.map(c => c.contentType));
      
      expect(types.has(ContentType.LESSON)).toBe(true);
      expect(types.has(ContentType.MINI_GAME)).toBe(true);
      expect(types.has(ContentType.QUIZ)).toBe(true);
    });
  });
});
