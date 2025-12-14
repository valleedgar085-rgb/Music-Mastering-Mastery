# Copilot Instructions for Music Mastering Mastery

This repository contains a skill assessment and adaptive learning platform for music mastering, built with TypeScript, Express, and a vanilla JavaScript frontend.

## Technology Stack

- **Backend**: TypeScript, Express 5, Node.js 18+
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Testing**: Jest with ts-jest
- **Build Tool**: TypeScript Compiler (tsc)
- **Package Manager**: npm

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
├── app.ts           # Express app configuration
└── index.ts         # Server entry point

public/              # Frontend static files
├── index.html       # Main application HTML
├── styles.css       # Complete styling and theme
└── app.js           # Frontend JavaScript logic
```

## Build and Test Commands

- **Install dependencies**: `npm install`
- **Build**: `npm run build` (compiles TypeScript to `dist/`)
- **Run tests**: `npm test`
- **Watch mode**: `npm run test:watch`
- **Coverage**: `npm run test:coverage`
- **Type check**: `npm run lint` (runs `tsc --noEmit`)
- **Development**: `npm run dev` (uses ts-node)
- **Production**: `npm start` (runs compiled JavaScript from `dist/`)

## Code Conventions

### TypeScript

1. **Strict mode enabled**: All TypeScript code uses strict type checking
2. **Enums**: Use string enums for categories, types, and statuses (see `src/types/enums.ts`)
3. **Interfaces**: Define all data models in `src/types/interfaces.ts`
4. **Documentation**: Add JSDoc comments for classes, methods, and interfaces
5. **Import order**: Group imports by external packages, then internal modules
6. **Type exports**: Export types from `src/types/index.ts`

### Naming Conventions

- **Files**: camelCase for TypeScript files (e.g., `userService.ts`)
- **Classes**: PascalCase (e.g., `UserService`, `AITeacherService`)
- **Interfaces**: PascalCase (e.g., `User`, `SkillRating`, `LearningPlan`)
- **Enums**: PascalCase for enum names, UPPER_SNAKE_CASE for values
- **Functions/Methods**: camelCase (e.g., `createUser`, `generateLearningPlan`)
- **Constants**: UPPER_SNAKE_CASE for true constants

### Service Architecture

- Services use **class-based architecture** with instance methods
- Each service has a corresponding test file (e.g., `userService.test.ts`)
- Services use **in-memory storage** (Map objects) - noted for production replacement
- Services are exported from `src/services/index.ts`

### API Design

- REST endpoints follow pattern: `/api/{resource}/{id?}/{action?}`
- Use Express Request/Response types from `@types/express`
- API routes are organized by resource (users, assessment, content)
- Error responses return JSON with `{ error: string }` format
- Success responses return JSON with appropriate data structure

### Testing

- Test files use `.test.ts` suffix
- Use Jest with ts-jest preset
- Test structure: Describe blocks for classes/functions, nested describes for methods
- Mock external dependencies when testing services
- Aim for comprehensive coverage of business logic

### Frontend (Vanilla JS)

- ES6+ JavaScript with modern features
- DOM manipulation using querySelector/querySelectorAll
- Fetch API for backend communication
- CSS follows BEM-like naming for components
- Design system uses consistent color palette (purple, blue, pink, orange, green)
- Google Fonts (Poppins) for typography

## Domain-Specific Guidelines

### Skill Categories

The system supports five core skill categories (defined in `SkillCategory` enum):
- FREQUENCY_FINDER
- EQ_SKILL
- BALANCING
- COMPRESSION
- SONG_STRUCTURE

When adding features, maintain consistency across all five categories.

### Rating System

- Skill ratings use 1-5 scale
- Difficulty levels: BEGINNER (1), INTERMEDIATE (2), ADVANCED (3), EXPERT (4), MASTER (5)
- Track history of rating changes with source attribution

### Content Types

Learning content includes four types (defined in `ContentType` enum):
- LESSON
- MINI_GAME
- QUIZ
- PRACTICE

### Assessment Flow

1. Start assessment → generates questions from question bank
2. User answers questions → tracked by assessment ID
3. Submit assessment → calculates skill ratings
4. Generate learning plan → AI Teacher creates personalized plan

## Extensibility Points

### Adding New Skill Categories

1. Add to `SkillCategory` enum in `src/types/enums.ts`
2. Add questions in `src/models/questionBank.ts`
3. Add learning content in `src/models/learningContent.ts`
4. Update UI to display new category

### Adding New Content Types

1. Add to `ContentType` enum
2. Update `LearningContent` interface if needed
3. Add content entries with new type
4. Update content filtering logic

### Adding New Question Types

1. Add to `QuestionType` enum
2. Update scoring logic in `AssessmentService` if needed
3. Update frontend to render new question type

## Common Pitfalls to Avoid

1. **Don't modify enums without updating all usages**: Enums are used across the codebase
2. **Don't forget test files**: All services and models should have corresponding tests
3. **Maintain type safety**: Avoid `any` types; use proper interfaces
4. **Keep services decoupled**: Services should be independently testable
5. **Don't hardcode IDs**: Use `uuid` package's v4 function for generating unique identifiers
6. **Remember in-memory storage limitation**: Data is not persisted between restarts

## Performance Considerations

- Frontend uses single-page application architecture
- Static assets served from `public/` directory
- CORS enabled for development (configured in `app.ts`)
- No database - all data stored in memory Maps

## Security Notes

- **Input validation needed**: Validate email format, string lengths, numeric ranges (e.g., skill ratings 1-5)
- **Sanitize user input**: Prevent XSS by sanitizing HTML in display names and text fields
- **CORS**: Currently allows all origins (development setting) - restrict to specific domains in production
- **Authentication/Authorization**: No auth implemented yet - add before production deployment
- **Rate limiting**: Consider adding for API endpoints to prevent abuse
- **SQL Injection**: Not applicable (in-memory storage), but validate if switching to database

## Dependencies

### Production
- express: Web framework
- uuid: Unique ID generation

### Development
- TypeScript and related @types packages
- Jest and ts-jest for testing
- Babel for JavaScript transformation

Keep dependencies minimal and up to date.
