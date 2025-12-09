# 📚 Neuro Learn Documentation

Welcome to the Neuro Learn documentation! This folder contains comprehensive guides for understanding and using the platform.

## 📖 Documentation Index

### Core Features

1. **[ML Models Explained](./ML_MODELS_EXPLAINED.md)**
   - How Machine Learning models personalize learning
   - Random Forest, K-Means, MLP Classifier
   - Feature building and recommendations

2. **[NLP Models Explained](./NLP_MODELS_EXPLAINED.md)**
   - Natural Language Processing for feedback analysis
   - DistilBERT for sentiment and confusion detection
   - LLM-based question simplification

3. **[TTS Usage Guide](./TTS_USAGE_GUIDE.md)**
   - Text-to-Speech implementation
   - How to use TTS in components
   - Audio file generation

4. **[Well-Being Layer Implementation](./WELLBEING_LAYER_IMPLEMENTATION.md)**
   - ADHD, Dyslexia, and ASD support features
   - Support mode triggers and actions
   - Implementation details

5. **[ASD Calm Mode Guide](./ASD_CALM_MODE_GUIDE.md)**
   - Predictability features for ASD learners
   - Calm mode implementation
   - Step-by-step guide

### Setup & Usage

6. **[Start Scripts Guide](./README_START.md)**
   - How to start backend and frontend
   - Script usage instructions
   - Troubleshooting

### Debug & Development

7. **[Backend Crash Debug](./BACKEND_CRASH_DEBUG.md)**
   - Common backend issues
   - Debugging steps
   - Solutions

8. **[Activity Loading Debug](./DEBUG_ACTIVITY_LOADING.md)**
   - Activity loading issues
   - Frontend-backend integration
   - Fixes

## 🚀 Quick Start

1. **Starting the Platform:**
   ```bash
   ./start.sh
   # or
   python3 start.py
   ```

2. **Understanding ML/NLP:**
   - Read `ML_MODELS_EXPLAINED.md` for ML models
   - Read `NLP_MODELS_EXPLAINED.md` for NLP features

3. **Using TTS:**
   - Read `TTS_USAGE_GUIDE.md` for implementation

4. **Well-Being Features:**
   - Read `WELLBEING_LAYER_IMPLEMENTATION.md` for support modes

## 📂 Project Structure

```
Neuro Learn/
├── docs/                    # 📚 Documentation (this folder)
│   ├── ML_MODELS_EXPLAINED.md
│   ├── NLP_MODELS_EXPLAINED.md
│   ├── TTS_USAGE_GUIDE.md
│   └── ...
├── backend/                 # 🐍 Python FastAPI backend
├── Frontend/                # ⚛️ React frontend
├── start.sh                 # 🚀 Start script (bash)
└── start.py                 # 🚀 Start script (Python)
```

## 🔗 Related Resources

- **GitHub Repository:** https://github.com/Prem-Rathod03/neuro-learn.git
- **Backend API Docs:** http://127.0.0.1:8030/docs (when running)
- **Frontend:** http://localhost:8080 (when running)

## 📝 Contributing

When adding new features, please update the relevant documentation:
- ML features → Update `ML_MODELS_EXPLAINED.md`
- NLP features → Update `NLP_MODELS_EXPLAINED.md`
- UI/UX features → Update relevant guides
- New scripts → Update `README_START.md`

## 📧 Support

For issues or questions:
1. Check the relevant documentation file
2. Review debug guides
3. Check GitHub issues

---

**Last Updated:** 2024
**Version:** 1.3.0
