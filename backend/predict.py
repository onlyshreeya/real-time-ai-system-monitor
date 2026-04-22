#!/usr/bin/env python3
"""
AI Prediction Module
Reads recent CPU values from stdin (JSON array), trains a LinearRegression model,
and outputs the predicted next value as JSON.

Usage:
  echo '[10, 20, 30, 25, 35]' | python3 predict.py
"""

import sys
import json
import numpy as np
from sklearn.linear_model import LinearRegression

def predict_next(values):
    if len(values) < 2:
        return {"prediction": values[-1] if values else 0, "confidence": 0, "error": "Not enough data"}

    X = np.array(range(len(values))).reshape(-1, 1)
    y = np.array(values)

    model = LinearRegression()
    model.fit(X, y)

    next_index = np.array([[len(values)]])
    prediction = float(model.predict(next_index)[0])

    # Clamp between 0 and 100
    prediction = max(0, min(100, prediction))

    # R² score as confidence proxy (clamped 0-100)
    r2 = model.score(X, y)
    confidence = round(max(0, min(100, r2 * 100)), 1)

    return {
        "prediction": round(prediction, 2),
        "confidence": confidence,
        "slope": round(float(model.coef_[0]), 4),
        "intercept": round(float(model.intercept_), 4),
    }

if __name__ == "__main__":
    try:
        raw = sys.stdin.read().strip()
        values = json.loads(raw)

        if not isinstance(values, list) or len(values) == 0:
            print(json.dumps({"error": "Expected non-empty JSON array", "prediction": 0, "confidence": 0}))
            sys.exit(1)

        result = predict_next(values)
        print(json.dumps(result))

    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input", "prediction": 0, "confidence": 0}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e), "prediction": 0, "confidence": 0}))
        sys.exit(1)