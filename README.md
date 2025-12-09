# Neuro Learn - Neurodiverse Learning Platform

A comprehensive learning platform designed to support children with ASD, ADHD, and Dyslexia through adaptive, personalized learning experiences powered by ML/DL models.

## 🎯 Features

- **Personalized Learning**: ML-powered activity recommendations based on user performance and behavior
- **Neurodiversity Support**: 
  - **Dyslexia**: Text-to-Speech (TTS) on hover/focus for word recognition
  - **ADHD**: Progress bars and focus tracking
  - **ASD**: Consistent feedback and structured learning paths
- **Adaptive Difficulty**: Random Forest model predicts optimal difficulty levels
- **Behavior Clustering**: K-Means clustering groups learners by behavior patterns
- **Feedback Analysis**: DistilBERT NLP model analyzes user feedback for confusion detection
- **Rephrase/Simplify**: LLM-powered question simplification (Ollama or Gemini API)
- **Attention Detection**: Placeholder for student attention detection model

## 🏗️ Architecture

### Frontend (`Frontend/`)
- **Framework**: React + TypeScript + Vite
- **UI**: shadcn/ui components with Tailwind CSS
- **State Management**: React Context API
- **Features**:
  - User authentication (login/register)
  - Learning activity interface
  - Progress tracking dashboard
  - Neurodiversity-specific UI adaptations

### Backend (`backend/`)
- **Framework**: FastAPI (Python)
- **Database**: MongoDB
- **ML/DL Models**:
  - Random Forest (difficulty prediction)
  - K-Means Clustering (learner grouping)
  - MLP Classifier (topic/modality recommendation)
  - DistilBERT (sentiment/confusion analysis)
- **LLM Integration**: Ollama (local) or Gemini API (cloud)

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **Python** (3.9+)
- **MongoDB** (running locally or connection string)
- **Ollama** (optional, for local LLM) or **Gemini API Key** (for cloud LLM)

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173` (or next available port)

### Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export MONGODB_URI="mongodb://localhost:27017"
export MONGODB_DB="neuro_learn"
export USE_OLLAMA="true"  # or "false" for Gemini
export OLLAMA_URL="http://localhost:11434"
export OLLAMA_MODEL="llama3.2"
# OR for Gemini:
# export LLM_API_KEY="your-gemini-api-key"
# export LLM_API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

# Run backend
uvicorn app.main:app --reload --port 8030
```

Backend will run on `http://127.0.0.1:8030`

### Environment Variables

Create `.env` files:

**Frontend `.env`:**
```
VITE_API_BASE_URL=http://127.0.0.1:8030
```

**Backend `.env`:**
```
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=neuro_learn
USE_OLLAMA=true
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
# OR for Gemini:
# LLM_API_KEY=your-api-key
# LLM_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
```

## 📁 Project Structure

```
Neuro Learn/
├── Frontend/              # React frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── contexts/     # React Context providers
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # API client and utilities
│   │   └── types/        # TypeScript type definitions
│   └── package.json
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── routes/       # API route handlers
│   │   ├── services/     # ML/NLP services
│   │   ├── models/       # Pydantic data models
│   │   ├── db/           # Database connection
│   │   └── data/         # Example activity data
│   ├── models/           # Trained ML models (generated)
│   └── requirements.txt
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Activities
- `GET /api/activity/next` - Get next recommended activity
- `POST /api/activity/submit` - Submit activity result

### Progress
- `GET /api/progress` - Get user progress statistics

### Rephrase
- `POST /api/rephrase` - Simplify/rephrase question using LLM

### Attention
- `POST /api/attention` - Analyze attention from image (placeholder)

## 🧠 ML Models

The system uses several ML models for personalization:

1. **Difficulty Prediction** (Random Forest): Predicts optimal difficulty based on user performance
2. **Behavior Clustering** (K-Means): Groups learners by behavior patterns
3. **Activity Recommendation** (MLP): Recommends next topic and modality
4. **Feedback Analysis** (DistilBERT): Analyzes sentiment and detects confusion

Models are auto-trained with dummy data on first run if not found in `backend/models/`.

## 🎨 Neurodiversity Features

### Dyslexia Support
- Text-to-Speech on hover/focus for word options
- Uses `instructionTts` and `option.ttsText` fields
- Enabled when `user.neuroFlags` includes "Dyslexia"

### ADHD Support
- Progress bars showing completion (e.g., "2 / 5 complete")
- Focus tracking and attention detection
- Enabled when `user.neuroFlags` includes "ADHD"

### ASD Support
- Consistent feedback patterns
- Structured learning sequences
- Avoids metaphors in instructions

## 🛠️ Development

### Adding New Activities

Activities follow the `ActivityItem` schema defined in:
- `backend/app/models/activity.py` (Pydantic)
- `Frontend/src/types/activity.ts` (TypeScript)

Add example activities to:
- `backend/app/data/activity_items.py`
- `Frontend/src/data/activityItems.ts`

### Training ML Models

Models are automatically trained on startup if not found. To retrain:

1. Delete model files in `backend/models/`
2. Restart backend server
3. Models will be retrained with synthetic data

For production, replace synthetic data with real user interaction logs.

## 📝 License

This project is for educational/research purposes.

## 🤝 Contributing

Contributions welcome! Please ensure:
- Code follows existing style
- Type hints are used (Python 3.9+ compatible)
- Tests pass (when tests are added)

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Note**: This is a development/demo version. For production use, ensure:
- Proper authentication/authorization
- Secure API keys management
- Real ML model training data
- Database security
- Error handling and logging

