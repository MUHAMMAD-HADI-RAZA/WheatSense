# app.py
import numpy as np
import tensorflow as tf
from PIL import Image
import gradio as gr

# Load Model
model = tf.keras.models.load_model("mobilenet_wheat_model.h5")

# Class Labels (keep your list here)
labels = [
    "Wheat___Brown_Rust", "Wheat___Ear_Cockle", "Wheat___Foot_Rot", "Wheat___Healthy",
    "Wheat___Karnal_Bunt", "Wheat___Powdery_Mildew", "Wheat___Smut_of_Wheat",
    "Wheat___Stem_Rust", "Wheat___Yellow_Rust"
]

# Disease Info Dictionary (keep it unchanged)
disease_info = {
    "Wheat___Yellow_Rust": """
🟡 **Yellow Rust (Stripe Rust)**
• **Symptoms:** Yellow powdery stripes on leaves.
• **Causal Organism:** *Puccinia striiformis*
• **Prevention:**
  ✓ Use resistant wheat varieties.
  ✓ Apply balanced fertilizers.
  ✓ Avoid excessive irrigation.
• **Fungicide Treatment:**
  ✓ Propiconazole 25% EC: 200 ml/100L water/acre.
  ✓ Tebuconazole 250 EC: 200 ml/100L water/acre.
• **Organic Treatment:**
  ✓ Neem oil (3%): 30 ml/L water, spray every 7–10 days.
• **Recommendations:**
  ✓ Spray fungicides at early infection.
  ✓ Remove infected crop debris.
""",
    "Wheat___Brown_Rust": """
🟤 **Brown Rust (Leaf Rust)**
• **Symptoms:** Brown pustules on leaf blades.
• **Causal Organism:** *Puccinia triticina*
• **Prevention:**
  ✓ Plant rust-resistant varieties.
  ✓ Follow crop rotation.
  ✓ Ensure good drainage.
• **Fungicide Treatment:**
  ✓ Triazole fungicides: 200 ml/100L water/acre.
  ✓ Mancozeb 75% WP: 2g/L water.
• **Organic Treatment:**
  ✓ 10% Milk spray: 1L milk in 10L water, weekly.
• **Recommendations:**
  ✓ Spray Triazoles.
  ✓ Neem oil for organic control.
""",
    "Wheat___Stem_Rust": """
⚫ **Stem Rust (Black Rust)**
• **Symptoms:** Black powder on stems.
• **Causal Organism:** *Puccinia graminis*
• **Prevention:**
  ✓ Use resistant varieties.
  ✓ Remove volunteer wheat plants.
• **Fungicide Treatment:**
  ✓ Mancozeb 75% WP: 2g/L water.
  ✓ Triadimefon 25% WP: 250g/ha.
• **Organic Treatment:**
  ✓ Garlic extract spray.
• **Recommendations:**
  ✓ Apply Mancozeb or Chlorothalonil.
  ✓ Scout fields regularly.
""",
    "Wheat___Karnal_Bunt": """
⚪ **Karnal Bunt (Partial Bunt)**
• **Symptoms:** Kernels turn fungal, fishy smell.
• **Causal Organism:** *Tilletia indica*
• **Prevention:**
  ✓ Use certified, disease-free seeds.
  ✓ Avoid cool, moist sowing conditions.
• **Seed Treatment:**
  ✓ Carbendazim 50 WP: 2g/kg seed.
  ✓ Thiram 75% WP: 2.5g/kg seed.
• **Field Treatment:**
  ✓ Propiconazole 25% EC: 200ml/100L water/acre.
• **Organic Treatment:**
  ✓ Mustard oil seed coating.
• **Recommendations:**
  ✓ Fungicide seed treatment before sowing.
  ✓ Avoid infected seed storage.
""",
    "Wheat___Smut_of_Wheat": """
⚫ **Smut of Wheat**
• **Symptoms:** Ears turn black, no grain.
• **Causal Organism:** *Ustilago tritici*
• **Prevention:**
  ✓ Always treat seeds.
  ✓ Avoid infected seeds.
• **Seed Treatment:**
  ✓ Tebuconazole 2% DS: 1.5g/kg seed.
  ✓ Carboxin 75 WP: 2g/kg seed.
• **Organic Treatment:**
  ✓ Hot water treatment at 52°C for 10 mins.
• **Recommendations:**
  ✓ Use fungicides.
  ✓ Burn infected plants.
""",
    "Wheat___Foot_Rot": """
🟤 **Foot Rot**
• **Symptoms:** Dark root lesions, stunted growth.
• **Causal Organism:** *Fusarium spp.*
• **Prevention:**
  ✓ Good field drainage.
  ✓ Crop rotation.
• **Seed Treatment:**
  ✓ Thiram 75% WP: 2.5g/kg seed.
  ✓ Carbendazim 50% WP: 1g/kg seed.
• **Organic Treatment:**
  ✓ *Trichoderma viride*: 5g/kg seed.
• **Recommendations:**
  ✓ Biofungicides for soil.
  ✓ Seed fungicide treatment.
""",
    "Wheat___Powdery_Mildew": """
⚪ **Powdery Mildew**
• **Symptoms:** White powdery patches on leaves.
• **Causal Organism:** *Erysiphe graminis*
• **Prevention:**
  ✓ Avoid excess nitrogen.
  ✓ Maintain airflow in fields.
• **Fungicide Treatment:**
  ✓ Sulfur 80% WP: 2g/L water.
  ✓ Potassium bicarbonate: 3g/L water.
• **Organic Treatment:**
  ✓ Baking soda spray.
• **Recommendations:**
  ✓ Sulfur fungicides.
  ✓ Potassium bicarbonate if infection spreads.
""",
    "Wheat___Ear_Cockle": """
🟠 **Ear Cockle**
• **Symptoms:** Yellow, D-shaped plants.
• **Causal Organism:** *Anguina tritici*
• **Prevention:**
  ✓ Use nematode-free seeds.
  ✓ Apply compost.
• **Seed/Soil Treatment:**
  ✓ Carbofuran 3G: 1kg/acre.
  ✓ Thiamethoxam 70 WS: 1.5g/kg seed.
• **Organic Treatment:**
  ✓ Neem cake: 10kg/acre.
• **Recommendations:**
  ✓ Nematocide treatments.
  ✓ Crop rotation.
""",
    "Wheat___Healthy": "🟢 Your crop is healthy. No issues detected!"
}

last_prediction = {"label": None}

def predict(image):
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    preds = model.predict(image, verbose=0)
    confidence = np.max(preds)
    label = labels[np.argmax(preds)]
    last_prediction["label"] = label

    if confidence < 0.6:
        return f"⚠️ Low confidence.\n🧪 Predicted: {label}\n📊 Confidence: {confidence*100:.2f}%"
    return f"🧪 Predicted: {label}\n📊 Confidence: {confidence*100:.2f}%"

def more_info():
    return disease_info.get(last_prediction["label"], "ℹ️ No info available.")

with gr.Blocks() as demo:
    gr.Markdown("## 🌾 Wheat Disease Detector (Gradio + Hugging Face)")
    with gr.Row():
        image_input = gr.Image(type="pil", label="📷 Upload Wheat Image")
        prediction_output = gr.Textbox(label="Prediction", lines=3)
    more_btn = gr.Button("📖 Show More Info")
    info_output = gr.Textbox(label="Disease Info", lines=10)
    image_input.change(fn=predict, inputs=image_input, outputs=prediction_output)
    image_input.change(fn=lambda: "", outputs=info_output)
    more_btn.click(fn=more_info, outputs=info_output)

demo.launch()
