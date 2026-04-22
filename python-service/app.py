from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json.get('values', [])

    if len(data) < 2:
        return jsonify({
            "prediction": 0,
            "confidence": 0,
            "slope": 0
        })

    x = np.arange(len(data))
    y = np.array(data)

    slope, intercept = np.polyfit(x, y, 1)
    prediction = y[-1] + slope

    return jsonify({
        "prediction": float(max(0, min(100, prediction))),
        "confidence": float(min(1, abs(slope)/10)),
        "slope": float(slope)
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)