import { Router, Request, Response } from 'express';
import { 
  learningContentLibrary, 
  getContentById, 
  getContentByCategory, 
  getContentByType,
  getContentByDifficulty 
} from '../models/learningContent';
import { SkillCategory, ContentType, DifficultyLevel } from '../types';

const router = Router();

/**
 * GET /api/content
 * Get all learning content with optional filters
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const { category, type, difficulty } = req.query;
    
    let content = learningContentLibrary;

    if (category && Object.values(SkillCategory).includes(category as SkillCategory)) {
      content = getContentByCategory(category as SkillCategory);
    }

    if (type && Object.values(ContentType).includes(type as ContentType)) {
      content = content.filter(c => c.contentType === type);
    }

    if (difficulty) {
      const diffLevel = Number(difficulty);
      if (!isNaN(diffLevel) && Number.isInteger(diffLevel) && diffLevel >= 1 && diffLevel <= 5) {
        content = content.filter(c => c.difficulty === diffLevel);
      }
    }

    res.json({
      content: content.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description,
        category: c.category,
        contentType: c.contentType,
        difficulty: c.difficulty,
        estimatedDuration: c.estimatedDuration,
        objectives: c.objectives
      })),
      total: content.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get content' });
  }
});

/**
 * GET /api/content/:id
 * Get specific content by ID
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const content = getContentById(id);

    if (!content) {
      res.status(404).json({ error: 'Content not found' });
      return;
    }

    res.json({
      id: content.id,
      title: content.title,
      description: content.description,
      category: content.category,
      contentType: content.contentType,
      difficulty: content.difficulty,
      estimatedDuration: content.estimatedDuration,
      prerequisites: content.prerequisites,
      objectives: content.objectives,
      contentData: content.contentData
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get content' });
  }
});

/**
 * GET /api/content/categories/summary
 * Get summary of content by category
 */
router.get('/categories/summary', (req: Request, res: Response) => {
  try {
    const summary = Object.values(SkillCategory).map(category => {
      const categoryContent = getContentByCategory(category);
      
      // Single-pass counting instead of multiple filter operations
      let lessons = 0;
      let miniGames = 0;
      let quizzes = 0;
      let beginner = 0;
      let intermediate = 0;
      let advanced = 0;
      let expert = 0;
      
      for (const content of categoryContent) {
        // Count by content type
        if (content.contentType === ContentType.LESSON) lessons++;
        else if (content.contentType === ContentType.MINI_GAME) miniGames++;
        else if (content.contentType === ContentType.QUIZ) quizzes++;
        
        // Count by difficulty
        if (content.difficulty === DifficultyLevel.BEGINNER) beginner++;
        else if (content.difficulty === DifficultyLevel.INTERMEDIATE) intermediate++;
        else if (content.difficulty === DifficultyLevel.ADVANCED) advanced++;
        else if (content.difficulty === DifficultyLevel.EXPERT) expert++;
      }
      
      return {
        category,
        totalContent: categoryContent.length,
        lessons,
        miniGames,
        quizzes,
        difficulties: {
          beginner,
          intermediate,
          advanced,
          expert
        }
      };
    });

    res.json({ categories: summary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get category summary' });
  }
});

export default router;
