import { Router, Request, Response } from 'express';
import { AssessmentService, UserService } from '../services';
import { AssessmentQuestion } from '../types';

const router = Router();
const assessmentService = new AssessmentService();
const userService = new UserService();

// In-memory store for active assessments
const activeAssessments = new Map<string, {
  userId: string;
  questions: AssessmentQuestion[];
  startTime: Date;
}>();

/**
 * POST /api/assessment/start
 * Start a new assessment for a user
 */
router.post('/start', (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    const user = userService.getUserById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.hasCompletedInitialAssessment) {
      res.status(400).json({ error: 'User has already completed initial assessment' });
      return;
    }

    // Generate assessment
    const { assessmentId, questions } = assessmentService.generateAssessment();

    // Store active assessment
    activeAssessments.set(assessmentId, {
      userId,
      questions,
      startTime: new Date()
    });

    // Return questions without correct answers
    const safeQuestions = questions.map(q => ({
      id: q.id,
      category: q.category,
      questionType: q.questionType,
      difficulty: q.difficulty,
      prompt: q.prompt,
      audioUrl: q.audioUrl,
      options: q.options,
      points: q.points,
      timeLimit: q.timeLimit,
      metadata: q.metadata ? { ...q.metadata, targetFreq: undefined, targetGain: undefined, targetQ: undefined, targetLevels: undefined } : undefined
    }));

    res.json({
      assessmentId,
      questions: safeQuestions,
      totalQuestions: questions.length,
      estimatedTime: '15-20 minutes'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start assessment' });
  }
});

/**
 * POST /api/assessment/submit
 * Submit assessment answers
 */
router.post('/submit', (req: Request, res: Response) => {
  try {
    const { assessmentId, answers } = req.body;

    if (!assessmentId || !answers) {
      res.status(400).json({ error: 'assessmentId and answers are required' });
      return;
    }

    const activeAssessment = activeAssessments.get(assessmentId);
    if (!activeAssessment) {
      res.status(404).json({ error: 'Assessment not found or expired' });
      return;
    }

    // Convert answers object to Map
    const answerMap = new Map<string, string | string[]>(Object.entries(answers));

    // Score the assessment
    const result = assessmentService.scoreAssessment(
      assessmentId,
      activeAssessment.userId,
      answerMap,
      activeAssessment.questions,
      activeAssessment.startTime
    );

    // Update user with assessment results and generate learning plan
    const updateResult = userService.completeInitialAssessment(
      activeAssessment.userId,
      result
    );

    if (!updateResult) {
      res.status(500).json({ error: 'Failed to update user with assessment results' });
      return;
    }

    // Clean up active assessment
    activeAssessments.delete(assessmentId);

    res.json({
      result: {
        id: result.id,
        overallScore: result.overallScore,
        sections: result.sections.map(s => ({
          category: s.category,
          categoryName: assessmentService.getCategoryDisplayName(s.category),
          totalQuestions: s.totalQuestions,
          correctAnswers: s.correctAnswers,
          percentageScore: s.percentageScore,
          rating: s.calculatedRating
        })),
        recommendations: result.recommendations
      },
      learningPlan: {
        id: updateResult.learningPlan.id,
        focusAreas: updateResult.learningPlan.focusAreas,
        totalItems: updateResult.learningPlan.items.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit assessment' });
  }
});

/**
 * GET /api/assessment/questions/:category
 * Get sample questions for a specific category (for practice)
 */
router.get('/questions/:category', (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { questions } = assessmentService.generateAssessment(5);
    
    const categoryQuestions = questions.filter(
      (q: AssessmentQuestion) => q.category === category
    );

    if (categoryQuestions.length === 0) {
      res.status(404).json({ error: 'Invalid category' });
      return;
    }

    // Return questions without correct answers
    const safeQuestions = categoryQuestions.map((q: AssessmentQuestion) => ({
      id: q.id,
      category: q.category,
      questionType: q.questionType,
      difficulty: q.difficulty,
      prompt: q.prompt,
      options: q.options,
      points: q.points
    }));

    res.json({ questions: safeQuestions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get questions' });
  }
});

export default router;
