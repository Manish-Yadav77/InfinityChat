
# InfinityChat - Repository Information

## Repository Summary
InfinityChat is a full-stack conversational AI chat application featuring real-time messaging with Google Gemini AI integration. Built with Node.js/Express backend and modern React frontend with Vite. Features include user authentication, chat history management, file upload capabilities, and a responsive UI powered by Tailwind CSS.

## Repository Structure
- **Backend**: Express.js REST API server with MongoDB integration
- **Frontend**: React SPA with Vite build tool
- **Database**: MongoDB for persistent data storage
- **AI Integration**: Google Generative AI (Gemini 2.5 Flash) and Groq API support

### Main Repository Components
- **Backend Server**: Express.js REST API with authentication and chat endpoints
- **Frontend Application**: React SPA with routing, state management, and responsive design
- **Data Models**: User authentication and chat history management
- **File Handling**: Multer-based file upload system with validation
- **Database Layer**: MongoDB models for users and chat conversations

---

## Projects

### Backend (Express.js REST API)
**Configuration File**: \`Backend/package.json\`

#### Language & Runtime
**Language**: JavaScript (ES Modules)
**Node.js Version**: ^18.x or higher
**Runtime Type**: ES Modules
**Main Entry Point**: \`server.js\`
**Package Manager**: npm
**Port**: 5000 (default, configurable via PORT env var)

#### Dependencies

**Main Dependencies**:
- \`express\` (^4.21.1) - Web framework and routing
- \`mongoose\` (^8.8.3) - MongoDB object modeling and database interaction
- \`@google/generative-ai\` (^0.21.0) - Google Gemini AI client library
- \`jsonwebtoken\` (^9.0.2) - JWT token generation and verification
- \`bcryptjs\` (^2.4.3) - Password hashing and security
- \`cors\` (^2.8.5) - Cross-origin resource sharing middleware
- \`dotenv\` (^16.4.5) - Environment variable configuration
- \`multer\` (^1.4.5-lts.1) - File upload handling (10MB limit)

**Development Dependencies**:
- \`nodemon\` (^3.1.7) - Auto-reload development server

#### Build & Installation
\`\`\`bash
cd Backend
npm install
npm start          # Start with nodemon (development mode)
npm run dev        # Alternative development command
\`\`\`

#### Configuration
**Environment Variables** (see \`.env.example\`):
\`\`\`
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongo_uri_here
JWT_SECRET=your_secret_key_here
GOOGLE_API_KEY=your_google_api_key_here
GROQ_API_KEY=your_groq_api_key_here
FRONTEND_URL=http://localhost:5173
\`\`\`

#### API Endpoints

**Authentication Routes** (\`/api/auth\`):
- \`POST /api/auth/signup\` - Register new user (name, email, password)
- \`POST /api/auth/login\` - Authenticate user and get JWT token
- \`GET /api/auth/me\` - Get current authenticated user profile (protected)

**Chat Routes** (\`/api/chat\`):
- \`POST /api/chat\` - Send message to AI with optional file uploads (protected)
  - Supports up to 5 file uploads per request
  - Allowed file types: JPEG, JPG, PNG, PDF, TXT, DOC, DOCX
  - Max file size: 10MB per file
- \`GET /api/chat/history\` - Retrieve all chat conversations for user (protected)
- \`GET /api/chat/:id\` - Get specific chat by ID (protected)
- \`DELETE /api/chat/:id\` - Delete chat and associated files (protected)

#### Database Models

**User Model** (\`models/User.js\`):
- \`name\` - User full name (required)
- \`email\` - Unique email address (required, validated)
- \`password\` - Hashed password (minlength: 6)
- \`avatar\` - User avatar URL
- Password comparison method for authentication

**Chat Model** (\`models/Chat.js\`):
- \`userId\` - Reference to User
- \`title\` - Chat title/subject
- \`messages\` - Array of message objects
  - Message properties: role (user/assistant), content, files array, timestamp
- \`model\` - AI model used (gemini-2.5-flash)
- Timestamps (createdAt, updatedAt)

#### Middleware & Configuration

**Authentication Middleware** (\`middleware/auth.js\`):
- JWT token verification
- Bearer token extraction from Authorization header
- User lookup and attachment to request object

**Database Configuration** (\`config/db.js\`):
- MongoDB connection setup
- Error handling with exit on connection failure

**File Upload Configuration**:
- Storage location: \`uploads/\` directory
- File naming: \`{timestamp}-{originalname}\`
- Allowed MIME types and extensions validation
- Error handling for unsupported file types

#### AI Integration

**Google Generative AI Configuration**:
- Model: \`gemini-2.5-flash\`
- Temperature: 0.7 (balanced creativity)
- TopP: 0.95
- TopK: 64
- Max Output Tokens: 8192
- Conversation history context maintained per chat

---

### Frontend (React + Vite)
**Configuration File**: \`Frontend/package.json\`

#### Language & Runtime
**Language**: JavaScript/JSX (ES Modules)
**React Version**: ^19.1.1 (Latest)
**Build Tool**: Vite (^7.1.7)
**Package Manager**: npm
**Node.js Version**: ^18.x or higher
**Development Port**: 5173 (default)
**Entry Point**: \`src/main.jsx\` → \`index.html\`

#### Dependencies

**Main Dependencies**:
- \`react\` (^19.1.1) - UI library and component framework
- \`react-dom\` (^19.1.1) - React DOM rendering and virtual DOM
- \`react-router-dom\` (^7.9.4) - Client-side routing and navigation
- \`axios\` (^1.13.0) - HTTP client for API requests
- \`zustand\` (^5.0.8) - Lightweight state management
- \`@tailwindcss/vite\` (^4.1.16) - Tailwind CSS Vite integration
- \`tailwindcss\` (^4.1.16) - Utility-first CSS framework
- \`lucide-react\` (^0.548.0) - Icon library with React components

**Development Dependencies**:
- \`vite\` (^7.1.7) - Build tool and dev server
- \`@vitejs/plugin-react\` (^5.0.4) - React plugin with Fast Refresh
- \`eslint\` (^9.36.0) - JavaScript linter
- \`@eslint/js\` (^9.36.0) - ESLint core rules
- \`eslint-plugin-react-hooks\` (^5.2.0) - React hooks ESLint plugin
- \`eslint-plugin-react-refresh\` (^0.4.22) - React refresh ESLint rules

#### Build & Installation
\`\`\`bash
cd Frontend
npm install
npm run dev           # Start Vite dev server (http://localhost:5173)
npm run build         # Production build to dist/
npm run preview       # Preview production build locally
npm run lint          # Run ESLint checks
\`\`\`

#### Build Configuration

**Vite Configuration** (\`vite.config.js\`):
- React plugin with Fast Refresh enabled
- Tailwind CSS Vite plugin for CSS processing
- SPA (Single Page Application) mode
- Development server with HMR

**ESLint Configuration** (\`eslint.config.js\`):
- ECMAScript 2020+ support
- React hooks linting
- React refresh plugin
- Browser globals
- Recommended ESLint rules

#### Application Structure

**Entry Points**:
- \`index.html\` - HTML root with div#root mount point
- \`src/main.jsx\` - React application bootstrap
- \`src/App.jsx\` - Main App component with routing

**Pages & Routing** (\`src/pages/\`):
- \`LandingPage\` - Public homepage and introduction
- \`Login\` - User login page
- \`SignUp\` - User registration page
- \`Home\` - Main chat interface (protected)
- Dynamic route: \`/home/:chatId\` - Specific chat conversation

**Components** (\`src/components/\`):
- Reusable UI components
- Chat interface components
- Authentication components
- Navigation components

**Context & State** (\`src/context/\`):
- \`AuthContext\` - Authentication state management
- User session management
- Auth provider wrapper

**Utilities** (\`src/utils/\`):
- Helper functions
- API integration utilities
- Common utilities

**Styling** (\`src/styles/\`):
- \`index.css\` - Global styles
- \`App.css\` - App component styles
- Tailwind CSS utility classes

**Assets** (\`src/assets/\`):
- Images
- Icons
- Static resources

**Public Assets** (\`public/\`):
- Static files served directly
- \`vite.svg\` - Vite logo

#### Development Features
**Vite Dev Server**:
- Hot Module Replacement (HMR) for instant updates
- Fast Refresh for React components
- Lightning-fast startup
- Optimized module serving

**Default URL**: http://localhost:5173

#### Authentication Flow
1. User registers or logs in via Login/SignUp pages
2. Backend returns JWT token
3. Token stored in local state (Zustand)
4. Token sent in Authorization header for protected routes
5. AuthContext wraps app for global auth state

---

## System Architecture & Integration

### Frontend to Backend Communication
- **Base URL**: \`http://localhost:5000/api\`
- **Protocol**: HTTP/HTTPS with CORS enabled
- **Default Dev**: http://localhost:5000 (configurable via FRONTEND_URL)
- **Authentication**: Bearer token in Authorization header

### Data Flow
1. Frontend sends request with JWT token
2. Backend middleware verifies token
3. Protected routes access user context
4. AI generates response using conversation history
5. Response saved to MongoDB
6. Updated chat sent back to frontend

### File Upload Flow
1. User selects files (up to 5)
2. Multer validates file type and size
3. Files stored in \`uploads/\` directory
4. File metadata stored with chat message
5. Files sent to AI for context
6. Files cleaned up when chat is deleted

### AI Processing
- Uses Google Generative AI Gemini 2.5 Flash model
- Maintains conversation history for context
- Generates responses with configurable parameters
- Supports multi-turn conversations
- File context in messages (images, documents)

---

## Environment Setup

### Required Environment Variables

**Backend (.env)**:
\`\`\`
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_API_KEY=your-google-generative-ai-key
GROQ_API_KEY=your-groq-api-key
FRONTEND_URL=http://localhost:5173
\`\`\`

### Obtaining API Keys
- **Google API Key**: https://makersuite.google.com/app/apikey
- **Groq API Key**: https://console.groq.com/
- **MongoDB URI**: https://www.mongodb.com/cloud/atlas

---

## Development Workflow

### Starting Both Servers
\`\`\`bash
# Terminal 1 - Start Backend
cd Backend
npm install
npm start

# Terminal 2 - Start Frontend
cd Frontend
npm install
npm run dev
\`\`\`

### Access Points
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- MongoDB: Configure via MONGO_URI

### Testing the Application
1. Visit http://localhost:5173
2. Click "Sign Up" to create account
3. Enter name, email, password
4. Login with credentials
5. Start chat with AI
6. Upload files (optional)
7. View chat history
8. Delete conversations

---

## Project Features

✅ **User Authentication**
- Secure registration and login
- Password hashing with bcryptjs
- JWT token-based authentication
- User profile management

✅ **AI Chat Interface**
- Real-time messaging with AI
- Multiple conversations
- Chat history management
- Conversation context retention

✅ **File Upload**
- Support for images, PDFs, documents
- File validation and size limits
- File attachment to messages
- Automatic cleanup on deletion

✅ **Responsive UI**
- Modern design with Tailwind CSS
- Mobile-friendly interface
- Icon library integration
- Smooth animations

✅ **Database Persistence**
- MongoDB integration
- User data storage
- Chat history archiving
- File metadata tracking

---

## Performance & Security

**Security Features**:
- Password hashing with bcryptjs
- JWT token authentication
- CORS configuration
- Protected routes middleware
- File type validation
- Input sanitization

**Performance Optimizations**:
- Vite for fast build times
- React Fast Refresh for dev experience
- Conversation history caching
- Lazy loading of components
- MongoDB indexing

---

## File Structure Summary

\`\`\`
LLM_ChatBox/
├── Backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   └── Chat.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── chat.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── Frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── package.json
│   └── .gitignore
└── README.md
\`\`\`

---

## Troubleshooting

**MongoDB Connection Issues**:
- Verify MONGO_URI is correct
- Check MongoDB Atlas IP whitelist
- Ensure cluster is running

**API Key Issues**:
- Verify GOOGLE_API_KEY is set
- Check key validity at Google AI Studio
- Restart server after changing .env

**File Upload Issues**:
- Check file size (max 10MB)
- Verify file type is allowed
- Ensure uploads directory exists

**CORS Issues**:
- Update FRONTEND_URL in backend .env
- Verify frontend is running on specified port

---

## Technologies Used

**Backend Stack**:
- Node.js with Express
- MongoDB with Mongoose
- Google Generative AI API
- JWT for authentication

**Frontend Stack**:
- React 19.1.1
- Vite build tool
- React Router for navigation
- Zustand for state management
- Tailwind CSS for styling
- Axios for API calls

**Development Tools**:
- Nodemon for server auto-reload
- ESLint for code quality
- Vite for fast development

---

## License & Author
License: MIT
