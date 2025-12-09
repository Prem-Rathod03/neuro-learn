# app/services/ml_engine.py

from __future__ import annotations

from collections import namedtuple
from pathlib import Path
from typing import Dict, List, Optional

import joblib
import numpy as np
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier

# What we return to activity.py
Reco = namedtuple("Reco", ["topic", "difficulty", "modality"])

# Paths where models will be saved/loaded
# Models saved in backend/models/ directory
_current_file = Path(__file__)
MODELS_DIR = _current_file.parent.parent.parent / "models"
MODELS_DIR.mkdir(exist_ok=True)

DIFF_MODEL_PATH = MODELS_DIR / "difficulty_rf.joblib"
CLUSTER_MODEL_PATH = MODELS_DIR / "behaviour_kmeans.joblib"
MLP_MODEL_PATH = MODELS_DIR / "activity_mlp.joblib"

# In-memory models
_difficulty_model: Optional[RandomForestClassifier] = None
_cluster_model: Optional[KMeans] = None
_activity_mlp: Optional[MLPClassifier] = None


# ------------- FEATURE → VECTOR HELPER -------------

FEATURE_KEYS: List[str] = [
    "avg_accuracy",
    "avg_time",
    "avg_difficulty_rating",
    "avg_focus_rating",
    "avg_attention_score",
    "avg_sentiment",
    "confusion_rate",
]


def features_to_vector(features: Dict) -> np.ndarray:
    """
    Convert feature dict to a fixed-length numeric vector for ML models.
    """
    vals = []
    for key in FEATURE_KEYS:
        vals.append(float(features.get(key, 0.0)))
    return np.array(vals, dtype=float).reshape(1, -1)


# ------------- TRAINING DUMMY MODELS (NO REAL DATA YET) -------------

def _train_dummy_models():
    """
    Train very small dummy models on synthetic data so that
    your backend actually uses Logistic/RandomForest/KMeans/MLP
    even before you train on real logs.

    You can later replace this with a proper offline training script.
    """
    global _difficulty_model, _cluster_model, _activity_mlp

    # Create small synthetic dataset: X in [0..1] for each feature
    rng = np.random.default_rng(42)
    X = rng.random((200, len(FEATURE_KEYS)))

    # y_diff: 0 = easy, 1 = medium, 2 = hard
    # rule: low accuracy => easy, mid => medium, high => hard
    y_diff = np.where(
        X[:, 0] < 0.4, 0, np.where(X[:, 0] < 0.75, 1, 2)
    )

    # y_cluster: behaviour types (0,1,2)
    # e.g., based on time + accuracy
    y_cluster = np.where(
        (X[:, 0] < 0.5) & (X[:, 1] > 0.6), 2,  # slow + low accuracy
        # else:
        0,
    )
    # To keep it simple, just let KMeans find 3 clusters on X itself
    # (we care more about having a cluster id than its meaning)

    # y_activity: combined topic+modality encoded as:
    #   0 = (reading, text)
    #   1 = (reading, audio)
    #   2 = (math, text)
    #   3 = (math, visual)
    # Quick dummy mapping based on random rule
    y_activity = np.where(
        X[:, 0] < 0.4, 0,
        np.where(X[:, 4] < 0.5, 1, 3)
    )

    # Difficulty model: RandomForestClassifier
    diff_model = RandomForestClassifier(n_estimators=50, random_state=42)
    diff_model.fit(X, y_diff)

    # Behaviour clustering: KMeans
    cluster_model = KMeans(n_clusters=3, random_state=42, n_init=10)
    cluster_model.fit(X)

    # Activity recommendation: MLPClassifier
    mlp = MLPClassifier(
        hidden_layer_sizes=(16, 8),
        activation="relu",
        max_iter=300,
        random_state=42,
    )
    mlp.fit(X, y_activity)

    # Save models
    joblib.dump(diff_model, DIFF_MODEL_PATH)
    joblib.dump(cluster_model, CLUSTER_MODEL_PATH)
    joblib.dump(mlp, MLP_MODEL_PATH)

    _difficulty_model = diff_model
    _cluster_model = cluster_model
    _activity_mlp = mlp


# ------------- LOADING MODELS -------------

def _load_models():
    """
    Load models from disk; if they don't exist, train dummy ones.
    """
    global _difficulty_model, _cluster_model, _activity_mlp

    if (
        _difficulty_model is not None
        and _cluster_model is not None
        and _activity_mlp is not None
    ):
        return

    if DIFF_MODEL_PATH.exists() and CLUSTER_MODEL_PATH.exists() and MLP_MODEL_PATH.exists():
        _difficulty_model = joblib.load(DIFF_MODEL_PATH)
        _cluster_model = joblib.load(CLUSTER_MODEL_PATH)
        _activity_mlp = joblib.load(MLP_MODEL_PATH)
    else:
        _train_dummy_models()


# ------------- PUBLIC FUNCTION USED BY activity.py -------------

def recommend_next(features: Dict) -> Reco:
    """
    Main entry point for your backend.

    Uses:
      - RandomForest to predict difficulty
      - KMeans to assign behaviour cluster
      - MLP to predict activity type (topic + modality)
    """
    _load_models()

    x_vec = features_to_vector(features)

    # 1) Difficulty prediction (RandomForest)
    diff_label = int(_difficulty_model.predict(x_vec)[0])  # 0/1/2
    if diff_label == 0:
        difficulty = "easy"
    elif diff_label == 1:
        difficulty = "medium"
    else:
        difficulty = "hard"

    # 2) Behaviour clustering (KMeans) — we might store this later
    cluster_id = int(_cluster_model.predict(x_vec)[0])
    # You can log cluster_id into DB if you want via activity.py

    # 3) Activity recommendation (MLP)
    activity_label = int(_activity_mlp.predict(x_vec)[0])  # 0..3

    # Decode activity_label into topic + modality
    if activity_label == 0:
        topic = "reading"
        modality = "text"
    elif activity_label == 1:
        topic = "reading"
        modality = "audio"
    elif activity_label == 2:
        topic = "math"
        modality = "text"
    else:
        topic = "math"
        modality = "visual"

    # For now we don't pass cluster_id back; you can
    # return it too if needed: Reco(topic, difficulty, modality, cluster_id)
    return Reco(topic=topic, difficulty=difficulty, modality=modality)
