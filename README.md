# Music Mastering Mastery

A skill assessment and adaptive learning platform for music mastering. This application provides interactive tests to evaluate users' mixing and mastering skills, then creates personalized learning plans based on their strengths and weaknesses.

## Features

### Initial Skill Assessment
- **Multi-section test** covering five core areas:
  - Frequency Finder - Identify and work with audio frequencies
  - EQ Skills - Equalization techniques and applications
  - Mix Balancing - Level management and stereo placement
  - Compression - Dynamic range control and processing
  - Song Structure - Arrangement, transitions, and song organization
- **Interactive question types**:
  - Multiple choice questions
  - Audio identification challenges
  - Interactive minigames (EQ matching, fader balancing)
  - Slider-based exercises
  - Ordering/arrangement tasks
- **Difficulty calibration** - Test is designed to be challenging for accurate skill assessment

### AI Teacher & Adaptive Learning
- **Automatic skill rating** (1-5 scale) per category based on assessment performance
- **Personalized learning plans** that prioritize weak areas
- **Content progression** from beginner to expert levels
- **Adaptive adjustments** based on quiz/game performance over time
- **Skill trend tracking** (improving, stable, declining)

### Learning Content Library
- **Lessons** - Educational content with text, video, and interactive elements
- **Mini-games** - Practice exercises for skill development
- **Quizzes** - Knowledge assessments to track progress
- **Prerequisites** - Structured learning paths with content dependencies

### User Dashboard
- **Skill ratings visualization** with trends
- **Progress tracking** across learning plan
- **Recent activity** history
- **Personalized recommendations**

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Start the server
npm start

# Or run in development mode
npm run dev
```

### API Endpoints

#### Users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/dashboard` - Get user dashboard data
- `GET /api/users/:id/learning-plan` - Get user's learning plan
- `POST /api/users/:id/progress` - Update learning progress
- `GET /api/users/:id/history` - Get assessment history

#### Assessment
- `POST /api/assessment/start` - Start new skill assessment
- `POST /api/assessment/submit` - Submit assessment answers

#### Content
- `GET /api/content` - Get all learning content (with optional filters)
- `GET /api/content/:id` - Get specific content by ID
- `GET /api/content/categories/summary` - Get content summary by category

## Usage Example

### 1. Create a User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "student@example.com", "displayName": "Audio Student"}'
```

### 2. Start Assessment

```bash
curl -X POST http://localhost:3000/api/assessment/start \
  -H "Content-Type: application/json" \
  -d '{"userId": "<user-id>"}'
```

### 3. Submit Answers

```bash
curl -X POST http://localhost:3000/api/assessment/submit \
  -H "Content-Type: application/json" \
  -d '{
    "assessmentId": "<assessment-id>",
    "answers": {
      "freq-1": "b",
      "freq-2": "a",
      "eq-1": "b"
    }
  }'
```

### 4. View Dashboard

```bash
curl http://localhost:3000/api/users/<user-id>/dashboard
```

## Project Structure

```
src/
├── types/           # TypeScript interfaces and enums
│   ├── enums.ts     # Skill categories, content types, etc.
│   └── interfaces.ts # Data models
├── models/          # Data definitions
│   ├── questionBank.ts    # Assessment questions
│   └── learningContent.ts # Lessons, games, quizzes
├── services/        # Business logic
│   ├── assessmentService.ts # Assessment generation and scoring
│   ├── aiTeacherService.ts  # Learning plan generation
│   └── userService.ts       # User management
├── routes/          # API endpoints
│   ├── assessmentRoutes.ts
│   ├── userRoutes.ts
│   └── contentRoutes.ts
├── app.ts           # Express app configuration
└── index.ts         # Server entry point
```

## Extensibility

The system is designed to be extensible:

### Adding New Skill Categories
1. Add the new category to `SkillCategory` enum in `src/types/enums.ts`
2. Add assessment questions in `src/models/questionBank.ts`
3. Add learning content in `src/models/learningContent.ts`

### Adding New Content Types
1. Add the new type to `ContentType` enum
2. Update the `LearningContent` interface if needed
3. Add content entries with the new type

### Adding New Question Types
1. Add the type to `QuestionType` enum
2. Update scoring logic in `AssessmentService` if needed
3. Add questions using the new type

## License

ISC