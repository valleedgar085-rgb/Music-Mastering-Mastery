import express, { Application, Request, Response, NextFunction } from 'express';
import { assessmentRoutes, userRoutes, contentRoutes } from './routes';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers for development
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Routes
app.use('/api/assessment', assessmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/content', contentRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API info
app.get('/api', (req: Request, res: Response) => {
  res.json({
    name: 'Music Mastering Mastery API',
    version: '1.0.0',
    description: 'Skill assessment and adaptive learning platform for music mastering',
    endpoints: {
      users: {
        'POST /api/users': 'Create new user',
        'GET /api/users/:id': 'Get user by ID',
        'GET /api/users/:id/dashboard': 'Get user dashboard',
        'GET /api/users/:id/learning-plan': 'Get user learning plan',
        'POST /api/users/:id/progress': 'Update learning progress',
        'GET /api/users/:id/history': 'Get assessment history'
      },
      assessment: {
        'POST /api/assessment/start': 'Start new assessment',
        'POST /api/assessment/submit': 'Submit assessment answers'
      },
      content: {
        'GET /api/content': 'Get all learning content',
        'GET /api/content/:id': 'Get content by ID',
        'GET /api/content/categories/summary': 'Get content summary by category'
      }
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
