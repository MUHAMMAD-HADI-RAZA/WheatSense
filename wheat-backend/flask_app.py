import os
import io
import base64
import time
import json
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
import cv2

try:
    from ultralytics import YOLO
except ImportError:
    print("Please install ultralytics: pip install ultralytics")

app = Flask(__name__)
CORS(app)

# ==========================================
# MODEL INITIALIZATION
# ==========================================
model1, model2 = None, None
model1_name = "YOLOv8 (best.pt)"
model2_name = "YOLOv10 Nano (yolo10.pt)"

try:
    model1_path = r"e:\react\yolo_venv\best.pt"
    if not os.path.exists(model1_path):
        model1_path = "best.pt"
    model1 = YOLO(model1_path)
    print(f"Loaded Model 1: {model1_path}")
except Exception as e:
    print(f"Error loading Model 1: {e}")

try:
    model2_path = r"e:\react\yolo10.pt"
    if not os.path.exists(model2_path):
        model2_path = "yolo10.pt"
    model2 = YOLO(model2_path)
    print(f"Loaded Model 2: {model2_path}")
except Exception as e:
    print(f"Error loading Model 2: {e}")

# ==========================================
# METADATA AND HELPERS
# ==========================================
disease_info = {
    "Yellow_Rust": {
        "title": "🟡 Yellow Rust (Stripe Rust)",
        "symptoms": "Yellow or orange powdery pustules arranged in distinct stripes along the leaf blades.",
        "causes": "Fungal pathogen Puccinia striiformis f. sp. tritici. Thrives in cool, wet weather (10-15°C).",
        "treatment": "Apply systemic fungicides such as Propiconazole 25% EC (200 ml/acre) or Tebuconazole.",
        "prevention": "Use resistant wheat varieties. Adjust sowing dates to avoid peak cool-wet periods.",
        "control": "Monitor fields regularly in early spring. Eradicate volunteer wheat which acts as a green bridge."
    },
    "Brown_Rust": {
        "title": "🟤 Brown Rust (Leaf Rust)",
        "symptoms": "Small, round, orange-brown pustules randomly scattered on the upper surface of leaves.",
        "causes": "Puccinia triticina fungus. Favored by warm (15-22°C) and humid conditions with prolonged leaf wetness.",
        "treatment": "Spray Triazole fungicides (e.g., Tebuconazole, Cyproconazole) at flag leaf emergence.",
        "prevention": "Crop rotation with non-host crops. Plant early to escape peak infection windows.",
        "control": "Balanced nitrogen application. Organic control includes 10% milk spray early in infection."
    },
    "Stem_Rust": {
        "title": "⚫ Stem Rust (Black Rust)",
        "symptoms": "Brick-red, elongated pustules on stems, leaf sheaths, and sometimes glumes, tearing the epidermis.",
        "causes": "Puccinia graminis f. sp. tritici. Requires warm days (25-30°C) and mild nights with free moisture.",
        "treatment": "Immediate application of Propiconazole or Azoxystrobin + Cyproconazole mixtures upon first sighting.",
        "prevention": "Eradicate alternate host plants (like barberry). Use resistant cultivars.",
        "control": "Avoid excessive nitrogen which promotes dense canopies. Ensure good field drainage."
    },
    "Karnal_Bunt": {
        "title": "⚪ Karnal Bunt (Partial Bunt)",
        "symptoms": "Grains are partially converted into a black, powdery mass with a distinct fishy odor.",
        "causes": "Tilletia indica fungus. Soil-borne and seed-borne; infects during flowering under humid conditions.",
        "treatment": "Foliar spray of Propiconazole 25% EC during the ear emergence (heading) stage.",
        "prevention": "Strictly use certified, disease-free seed. Seed treatment with Carbendazim 50 WP.",
        "control": "Avoid continuous wheat cropping. Deep summer ploughing to bury fungal spores."
    },
    "Smut_of_Wheat": {
        "title": "⚫ Smut of Wheat",
        "symptoms": "Entire ear/head is replaced by a mass of black fungal spores, eventually blowing away leaving a bare rachis.",
        "causes": "Ustilago tritici. Strictly seed-borne; infects embryos during flowering of the previous crop.",
        "treatment": "No foliar treatment is effective once symptoms appear. Must rely on seed treatment.",
        "prevention": "Seed treatment with systemic fungicides like Carboxin (Vitavax) or Tebuconazole 2% DS before sowing.",
        "control": "Solar heat treatment of seeds or hot water treatment (54°C for 10 mins) for organic farming."
    },
    "Foot_Rot": {
        "title": "🟤 Foot Rot",
        "symptoms": "Browning and rotting of the stem base and roots, leading to stunted plants and 'whiteheads' (empty ears).",
        "causes": "Complex of soil-borne fungi (Fusarium spp., Bipolaris sorokiniana). Worsened by moisture stress.",
        "treatment": "Apply biological agents like Trichoderma viride enriched compost to the soil.",
        "prevention": "Seed treatment with Thiram 75% WP or Carboxin. Maintain optimum soil moisture.",
        "control": "Delay sowing if soil temperatures are very high. Ensure balanced NPK nutrition."
    },
    "Powdery_Mildew": {
        "title": "⚪ Powdery Mildew",
        "symptoms": "White, fluffy, cottony patches on the upper surface of lower leaves, turning greyish-brown later.",
        "causes": "Blumeria graminis f. sp. tritici. Favored by high humidity, dense crop canopies, and cool temperatures.",
        "treatment": "Foliar spray of Sulfur 80% WP or systemic fungicides like Fenpropimorph or Tebuconazole.",
        "prevention": "Avoid overly dense seeding rates and excessive nitrogen fertilization.",
        "control": "Improve canopy airflow. Organic: Potassium bicarbonate or Neem oil sprays."
    },
    "Ear_Cockle": {
        "title": "🟠 Ear Cockle",
        "symptoms": "Leaves become wrinkled and twisted. Grains are replaced by hard, dark brown/black galls.",
        "causes": "Nematode Anguina tritici, often associated with Yellow Ear Rot bacterium (Rathayibacter tritici).",
        "treatment": "Chemicals are generally ineffective in standing crops. Pull out and destroy infected plants.",
        "prevention": "Use nematode-free certified seeds. Separate galls from seed wheat using 20% brine solution flotation.",
        "control": "Crop rotation for 1-2 years with non-host crops to starve nematodes in the soil."
    },
    "Leaf_Blight": {
        "title": "🍂 Leaf Blight",
        "symptoms": "Irregular, oval-shaped brown to necrotic lesions with yellow halos, starting from lower leaves.",
        "causes": "Bipolaris sorokiniana or Alternaria triticina. Worsened by warm, humid weather and late sowing.",
        "treatment": "Spray Mancozeb 75% WP or Propiconazole 25% EC at 15-day intervals upon disease onset.",
        "prevention": "Use clean, treated seeds. Timely sowing to avoid high temperatures during grain filling.",
        "control": "Manage crop debris from previous seasons as it harbors the pathogen. Ensure adequate Potassium."
    },
    "Healthy": {
        "title": "🟢 Healthy Wheat",
        "symptoms": "Normal green coloration, upright growth, well-developed heads, no visible lesions or fungal growth.",
        "causes": "Optimal environmental conditions, good genetics, and proper farm management.",
        "treatment": "No treatment required. Maintain current agronomic practices.",
        "prevention": "Continue regular monitoring and preventive protective sprays if weather conditions favor diseases.",
        "control": "Maintain balanced fertilization, optimal irrigation, and field hygiene to ensure continued health."
    }
}

HISTORY_FILE = "prediction_history.json"

def log_prediction(model1_res, model2_res):
    try:
        history = []
        if os.path.exists(HISTORY_FILE):
            with open(HISTORY_FILE, 'r') as f:
                history = json.load(f)
        
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "model1": {
                "detections": model1_res["total_detections"],
                "avg_confidence": model1_res["average_confidence"],
                "inference_time_ms": model1_res["inference_time_ms"],
                "classes": [d["name"] for d in model1_res["detections"]]
            },
            "model2": {
                "detections": model2_res["total_detections"],
                "avg_confidence": model2_res["average_confidence"],
                "inference_time_ms": model2_res["inference_time_ms"],
                "classes": [d["name"] for d in model2_res["detections"]]
            }
        }
        history.append(log_entry)
        with open(HISTORY_FILE, 'w') as f:
            json.dump(history, f, indent=4)
    except Exception as e:
        print(f"Failed to log history: {e}")

def run_inference(model, img, conf_thresh):
    start_time = time.time()
    results = model.predict(img, conf=conf_thresh, verbose=False)
    inf_time = (time.time() - start_time) * 1000 # ms
    
    annotated_img = results[0].plot()
    _, buffer = cv2.imencode('.jpg', annotated_img)
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    
    boxes = results[0].boxes
    detections = []
    total_conf = 0.0
    
    for box in boxes:
        class_id = int(box.cls[0])
        confidence = float(box.conf[0])
        total_conf += confidence
        
        raw_name = model.names[class_id]
        clean_name = raw_name.replace("Wheat___", "")
        info_obj = disease_info.get(clean_name, {"title": f"Unknown: {clean_name}"})
        
        detections.append({
            "class_id": class_id,
            "name": clean_name,
            "title": info_obj["title"],
            "confidence": round(confidence * 100, 2),
            "bbox": box.xyxy[0].tolist(),
            "symptoms": info_obj.get("symptoms", "No data available"),
            "causes": info_obj.get("causes", "No data available"),
            "treatment": info_obj.get("treatment", "No data available"),
            "prevention": info_obj.get("prevention", "No data available"),
            "control": info_obj.get("control", "No data available")
        })
        
    avg_conf = round((total_conf / len(boxes) * 100), 2) if boxes else 0.0
    
    return {
        "success": True,
        "total_detections": len(detections),
        "average_confidence": avg_conf,
        "inference_time_ms": round(inf_time, 2),
        "detections": detections,
        "annotated_image": f"data:image/jpeg;base64,{img_base64}"
    }

# ==========================================
# ROUTES
# ==========================================
@app.route('/predict', methods=['POST'])
def predict():
    if model1 is None or model2 is None:
        return jsonify({"error": "Both models are not loaded properly."}), 500

    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty file"}), 400

    conf_thresh = float(request.form.get('confidence', 0.25))

    try:
        image_bytes = file.read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"error": "Invalid image format"}), 400

        # Run models
        res1 = run_inference(model1, img, conf_thresh)
        res2 = run_inference(model2, img, conf_thresh)
        
        # Compare and decide Best Model Recommendation
        # Logic: We prefer the model that detected at least something. 
        # If both detected, prefer higher confidence, then faster speed.
        recommended = "Tie"
        reason = ""
        if res1["total_detections"] > res2["total_detections"]:
            recommended = model1_name
            reason = "Model 1 found more relevant objects."
        elif res2["total_detections"] > res1["total_detections"]:
            recommended = model2_name
            reason = "Model 2 found more relevant objects."
        else:
            if res1["average_confidence"] > res2["average_confidence"]:
                recommended = model1_name
                reason = "Model 1 has higher average confidence."
            elif res2["average_confidence"] > res1["average_confidence"]:
                recommended = model2_name
                reason = "Model 2 has higher average confidence."
            else:
                if res1["inference_time_ms"] < res2["inference_time_ms"]:
                    recommended = model1_name
                    reason = "Model 1 is faster with identical results."
                else:
                    recommended = model2_name
                    reason = "Model 2 is faster with identical results."

        log_prediction(res1, res2)

        return jsonify({
            "success": True,
            "comparison": {
                "recommended_model": recommended,
                "reason": reason
            },
            "model1": {
                "name": model1_name,
                "results": res1
            },
            "model2": {
                "name": model2_name,
                "results": res2
            }
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/analytics', methods=['GET'])
def get_analytics():
    try:
        if not os.path.exists(HISTORY_FILE):
            return jsonify({"success": True, "history": []})
        with open(HISTORY_FILE, 'r') as f:
            history = json.load(f)
        return jsonify({"success": True, "history": history})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
