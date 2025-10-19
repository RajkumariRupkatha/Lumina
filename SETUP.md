# UniLearn - AI-Powered LMS Setup Guide

## Overview

UniLearn is an AI-powered Learning Management System with real-time material synchronization between professors and students, powered by Google's Gemini API.

## Features Implemented

### ✅ Professor Features
- **Material Upload System**: Upload PDF, PPT, DOCX, images, and videos
- **Real-time Sync**: Materials appear instantly on student side
- **AI Auto-Generation**: Automatic creation of:
  - Flashcards (5 per material)
  - Quiz Questions (5 MCQ per material)
  - Mind Maps (6-branch structure)
  - Study Guides & Summaries
  - Key Topics Extraction
- **Assignment Creation**: Auto-adds to student calendars
- **Course Management Dashboard**

### ✅ Student Features
- **Real-time Material Access**: See professor uploads instantly
- **AI Study Tools** (auto-generated):
  - AI Flashcards
  - AI Quiz Generator
  - AI Mind Mapping
  - AI Study Guide
  - AI Notes Generator
- **Gamification System**:
  - XP points for engaging with materials
  - Achievement system (14 achievements)
  - Progress tracking
- **Calendar Integration**: See all due dates and deadlines
- **Multi-format Support**: View PDFs, videos, images, documents

## Setup Instructions

### 1. Get Your Free Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the API key

### 2. Configure Environment Variables

1. In your project root (`c:\UniLearn`), create a `.env` file:

```bash
# Create .env file
copy .env.example .env
```

2. Open `.env` and add your Gemini API key:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Important**: Replace `your_actual_api_key_here` with the API key you copied from Google AI Studio.

### 3. Install Dependencies (if not already done)

```bash
npm install
```

### 4. Run the Application

```bash
npm run dev
```

The app will run at `http://localhost:3001` (or 3000 if available)

## How to Use

### For Demo Purposes:

#### 1. **Switch Between Roles**
- Click the **"Switch to Professor View"** button in the top bar
- Toggle between Student and Professor modes

#### 2. **As Professor - Upload Material**
1. Switch to Professor view
2. Click on any course (e.g., "CS 201 - Data Structures")
3. Click **"Upload Material"** button
4. Select a PDF, PPT, or other file
5. Watch the AI processing indicator
6. Material appears with AI-generated tools

#### 3. **As Student - Access Materials**
1. Switch to Student view
2. Go to the same course
3. See the uploaded material appear in real-time
4. Access AI-generated:
   - Flashcards for studying
   - Quizzes for practice
   - Mind maps for visual learning
   - Study guides for review

#### 4. **Gamification in Action**
- Students earn +10 XP when new materials are uploaded
- Achievements unlock based on activities
- Streak tracking for daily engagement

## AI Features Explained

### 1. **Flashcard Generation**
- Gemini analyzes the document
- Extracts key concepts
- Creates question/answer pairs
- Fallback to mock data if API fails

### 2. **Quiz Generation**
- Creates multiple-choice questions
- Generates 4 options per question
- Identifies correct answers
- Based on document content

### 3. **Mind Map Creation**
- Identifies central concept
- Creates 6 main topic branches
- Visualizes relationships
- Helps with understanding structure

### 4. **Study Guide & Summary**
- Concise 3-4 sentence summaries
- Key topics extraction
- Learning objectives
- Prerequisites identification

## File Format Support

### Supported Upload Formats:
- **Documents**: PDF (`.pdf`), Word (`.docx`)
- **Presentations**: PowerPoint (`.ppt`, `.pptx`)
- **Images**: PNG, JPG, JPEG
- **Videos**: MP4, WebM

## Troubleshooting

### API Key Issues

**Problem**: "Gemini API key not found" warning in console

**Solution**:
1. Check that `.env` file exists in project root
2. Verify the key starts with `VITE_GEMINI_API_KEY=`
3. Restart the development server after adding the key
4. Clear browser cache

### Material Not Syncing

**Problem**: Materials uploaded by professor don't appear for students

**Solution**:
1. The sync is in-memory only (for demo purposes)
2. Both views must be open in the same browser session
3. Refresh will clear uploaded materials
4. For production, you'd need a backend database

### AI Generation Slow

**Problem**: AI tools take long to generate

**Solution**:
- This is normal - Gemini API can take 2-5 seconds
- The system shows a loading indicator
- Fallback mock data activates if API times out
- Free tier has rate limits

## API Rate Limits

**Google Gemini Free Tier**:
- 60 requests per minute
- Sufficient for demo purposes
- Upgrade to paid tier for production

## Development Notes

### Real-time Sync Implementation:
```typescript
// Materials stored in shared state
const [courseMaterials, setCourseMaterials] = useState({});

// Professor uploads
setCourseMaterials(prev => ({
  ...prev,
  [courseId]: [...materials, newMaterial]
}));

// Student sees immediately
courseMaterials[courseId]?.map(material => ...)
```

### Gemini API Integration:
```typescript
// API call helper
async function callGeminiAPI(prompt: string) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );
  return response.json();
}
```

## Next Steps for Production

1. **Backend Integration**:
   - Add database (PostgreSQL/MongoDB)
   - Implement proper user authentication
   - Store materials persistently

2. **WebSocket/Real-time DB**:
   - Use Socket.io or Firebase
   - True real-time updates across users
   - Push notifications

3. **File Storage**:
   - AWS S3 or Google Cloud Storage
   - Proper file management
   - CDN for fast delivery

4. **Enhanced AI**:
   - Document parsing (extract text from PDFs)
   - Image analysis for diagrams
   - Video transcription
   - Multi-modal learning

## Support

For issues or questions:
- Check browser console for errors
- Verify API key is correct
- Ensure `.env` file is properly formatted
- Restart dev server after changes

## Demo Checklist

✅ Get Gemini API key
✅ Create `.env` file
✅ Add API key to `.env`
✅ Run `npm run dev`
✅ Switch to Professor view
✅ Upload a test file
✅ Switch to Student view
✅ See material appear with AI tools
✅ Test flashcards, quizzes, mind maps
✅ Check XP and achievements

---

**Your system is ready for demo!** 🚀
