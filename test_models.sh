#!/bin/bash
# Quick script to test if ML/NLP models are working

echo "🧪 Testing ML & NLP Models..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Backend running?
echo -n "1. Backend running (port 8030)... "
if lsof -ti:8030 >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Start backend first${NC}"
    exit 1
fi

# Test 2: MongoDB running?
echo -n "2. MongoDB running... "
if mongosh --quiet --eval "db.version()" >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Start MongoDB first${NC}"
    exit 1
fi

# Test 3: ML model files exist?
echo -n "3. ML model files exist... "
if [ -f "backend/models/difficulty_rf.joblib" ] && [ -f "backend/models/behaviour_kmeans.joblib" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ Models will be created on first use${NC}"
fi

# Test 4: Analytics endpoint working?
echo -n "4. Analytics API working... "
if curl -s http://127.0.0.1:8030/api/analytics/models >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Analytics endpoint not responding${NC}"
fi

# Test 5: MongoDB collections
echo ""
echo "📊 MongoDB Statistics:"
echo -n "   - Interactions: "
COUNT=$(mongosh neuro_learn --quiet --eval "db.interactions.count()" 2>/dev/null || echo "0")
echo "$COUNT"

echo -n "   - ML Predictions: "
COUNT=$(mongosh neuro_learn --quiet --eval "db.ml_predictions.count()" 2>/dev/null || echo "0")
echo "$COUNT"

echo -n "   - NLP Analyses: "
COUNT=$(mongosh neuro_learn --quiet --eval "db.nlp_analyses.count()" 2>/dev/null || echo "0")
echo "$COUNT"

echo -n "   - Rephrase Requests: "
COUNT=$(mongosh neuro_learn --quiet --eval "db.rephrase_requests.count()" 2>/dev/null || echo "0")
echo "$COUNT"

# Test 6: Get analytics summary
echo ""
echo "📈 Model Performance:"
curl -s http://127.0.0.1:8030/api/analytics/models 2>/dev/null | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(f\"   - Total interactions: {data.get('total_interactions', 0)}\")
    ml = data.get('ml_analytics', {})
    print(f\"   - ML recommendations: {ml.get('total_recommendations', 0)}\")
    print(f\"   - Accuracy rate: {ml.get('accuracy_rate', 0):.2%}\")
    nlp = data.get('nlp_analytics', {})
    print(f\"   - Sentiment analyses: {nlp.get('sentiment_analyses', 0)}\")
    print(f\"   - Confusion detections: {nlp.get('confusion_detections', 0)}\")
except:
    print('   Unable to fetch analytics')
"

echo ""
echo -e "${GREEN}✅ Test complete!${NC}"
echo ""
echo "📖 To test models manually:"
echo "   1. Go to http://localhost:5173"
echo "   2. Complete some activities"
echo "   3. Submit feedback with text"
echo "   4. Click 'Rephrase / Simplify'"
echo "   5. Run this script again to see updated counts"
echo ""
echo "📚 For detailed testing: cat TEST_MODELS_GUIDE.md"
