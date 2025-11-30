import { Router, Request, Response } from 'express';
import { UserService } from '../services';

const router = Router();
const userService = new UserService();

/**
 * POST /api/users
 * Create a new user
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const { email, displayName } = req.body;

    if (!email || !displayName) {
      res.status(400).json({ error: 'email and displayName are required' });
      return;
    }

    const user = userService.createUser(email, displayName);
    
    res.status(201).json({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      hasCompletedInitialAssessment: user.hasCompletedInitialAssessment,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = userService.getUserById(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      hasCompletedInitialAssessment: user.hasCompletedInitialAssessment,
      skillRatings: user.skillRatings.map(r => ({
        category: r.category,
        rating: r.rating,
        lastAssessed: r.lastAssessed
      })),
      createdAt: user.createdAt,
      lastActiveAt: user.lastActiveAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

/**
 * GET /api/users/:id/dashboard
 * Get user dashboard data
 */
router.get('/:id/dashboard', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dashboard = userService.getDashboard(id);

    if (!dashboard) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: dashboard.user.id,
        displayName: dashboard.user.displayName,
        hasCompletedInitialAssessment: dashboard.user.hasCompletedInitialAssessment
      },
      skillRatings: dashboard.skillRatings,
      currentPlan: dashboard.currentPlan ? {
        id: dashboard.currentPlan.id,
        progress: Math.round(dashboard.currentPlan.progress),
        currentItem: dashboard.currentPlan.currentItem ? {
          id: dashboard.currentPlan.currentItem.id,
          title: dashboard.currentPlan.currentItem.title,
          description: dashboard.currentPlan.currentItem.description,
          contentType: dashboard.currentPlan.currentItem.contentType,
          difficulty: dashboard.currentPlan.currentItem.difficulty,
          estimatedDuration: dashboard.currentPlan.currentItem.estimatedDuration
        } : undefined,
        nextItems: dashboard.currentPlan.nextItems.map(item => ({
          id: item.id,
          title: item.title,
          contentType: item.contentType,
          difficulty: item.difficulty
        }))
      } : undefined,
      recentActivity: dashboard.recentActivity.map(a => ({
        date: a.date,
        activity: a.activity,
        score: a.score ? Math.round(a.score) : undefined
      })),
      recommendations: dashboard.recommendations
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get dashboard' });
  }
});

/**
 * GET /api/users/:id/learning-plan
 * Get user's current learning plan
 */
router.get('/:id/learning-plan', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const plan = userService.getLearningPlan(id);

    if (!plan) {
      res.status(404).json({ error: 'Learning plan not found' });
      return;
    }

    res.json({
      id: plan.id,
      focusAreas: plan.focusAreas,
      currentItemIndex: plan.currentItemIndex,
      items: plan.items.map(item => ({
        id: item.id,
        contentId: item.contentId,
        order: item.order,
        status: item.status,
        score: item.score,
        attempts: item.attempts
      })),
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get learning plan' });
  }
});

/**
 * POST /api/users/:id/progress
 * Update user progress after completing content
 */
router.post('/:id/progress', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { contentId, score } = req.body;

    if (!contentId || score === undefined) {
      res.status(400).json({ error: 'contentId and score are required' });
      return;
    }

    const result = userService.updateProgress(id, contentId, score);

    if (!result) {
      res.status(404).json({ error: 'User or learning plan not found' });
      return;
    }

    res.json({
      success: true,
      updatedSkillRatings: result.user.skillRatings.map(r => ({
        category: r.category,
        rating: Math.round(r.rating * 10) / 10
      })),
      planProgress: Math.round(
        (result.learningPlan.items.filter(i => 
          i.status === 'COMPLETED' || i.status === 'MASTERED'
        ).length / result.learningPlan.items.length) * 100
      )
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

/**
 * GET /api/users/:id/history
 * Get user's assessment history
 */
router.get('/:id/history', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = userService.getUserById(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const history = userService.getAssessmentHistory(id);

    res.json({
      assessments: history.map(a => ({
        id: a.id,
        completedAt: a.completedAt,
        overallScore: Math.round(a.overallScore),
        sections: a.sections.map(s => ({
          category: s.category,
          rating: s.calculatedRating,
          percentageScore: Math.round(s.percentageScore)
        }))
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get history' });
  }
});

export default router;
