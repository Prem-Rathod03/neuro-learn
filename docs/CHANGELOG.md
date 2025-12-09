# Changelog

All notable changes to the Neuro Learn project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-XX

### Added
- Initial release of Neuro Learn platform
- **Frontend**:
  - React + TypeScript frontend with Vite
  - User authentication (login/register)
  - Learning activity interface with multiple activity types
  - Progress tracking dashboard
  - Neurodiversity-specific UI features:
    - Text-to-Speech (TTS) for Dyslexia learners
    - Progress bars for ADHD learners
    - Structured learning paths for ASD learners
  - Activity renderer supporting:
    - Image-to-word matching
    - One-step and two-step instructions
    - Counting and visual addition
    - Pattern recognition
    - Focus filter activities
  - Rephrase/Simplify feature using LLM
  - Responsive design with Tailwind CSS and shadcn/ui components

- **Backend**:
  - FastAPI backend with MongoDB database
  - User authentication with bcrypt password hashing
  - ML-powered activity recommendation system:
    - Random Forest for difficulty prediction
    - K-Means clustering for learner grouping
    - MLP classifier for topic/modality recommendation
  - NLP feedback analysis using DistilBERT:
    - Sentiment analysis
    - Confusion detection
  - LLM integration for question rephrasing:
    - Ollama support (local LLM)
    - Gemini API support (cloud LLM)
  - Activity management with standardized ActivityItem schema
  - Progress tracking and analytics
  - Attention detection endpoint (placeholder)

- **Features**:
  - Adaptive learning based on user performance
  - Personalized activity recommendations
  - Neurodiversity flags support (ADHD, Dyslexia, ASD)
  - Real-time feedback analysis
  - Question simplification for confused learners
  - Offline mode with fallback to mock data

### Technical Details
- Frontend: React 18, TypeScript, Vite, Tailwind CSS
- Backend: FastAPI, Python 3.9+, MongoDB
- ML Libraries: scikit-learn, transformers, torch
- Database: MongoDB with Motor (async driver)
- Authentication: JWT-like tokens with bcrypt

### Known Limitations
- ML models use synthetic/dummy data (need real user data for production)
- Attention detection model is a placeholder
- Some features require backend to be running (with fallback to mock data)

