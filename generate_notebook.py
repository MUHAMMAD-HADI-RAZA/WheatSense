import json

def create_notebook():
    notebook = {
        "cells": [],
        "metadata": {
            "colab": {
                "provenance": []
            },
            "kernelspec": {
                "display_name": "Python 3",
                "name": "python3"
            },
            "language_info": {
                "name": "python"
            }
        },
        "nbformat": 4,
        "nbformat_minor": 0
    }

    def add_markdown(text):
        notebook["cells"].append({
            "cell_type": "markdown",
            "metadata": {},
            "source": [text]
        })

    def add_code(text):
        notebook["cells"].append({
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [line + "\n" if not line.endswith("\n") else line for line in text.split("\n")][:-1] # Ensure proper line endings
        })

    # Cell 1
    add_markdown("""# Wheat Disease Detection System - YOLOv8
**Final Year Project / Research Notebook**

This notebook contains a complete pipeline for training a YOLOv8 object detection model on a custom Wheat Disease dataset.
It covers environment setup, data visualization, model training, validation, evaluation metrics, and inference.

**Classes:**
`0: Yellow_Rust, 1: Brown_Rust, 2: Leaf_Blight, 3: Healthy, 4: Ear_Cockle, 5: Foot_Rot, 6: Karnal_Bunt, 7: Powdery_Mildew, 8: Smut_of_Wheat, 9: Stem_Rust`""")

    # Cell 2
    add_code("""# 1. GPU Check and Initialization
import torch

print("================ GPU CHECK ================")
if torch.cuda.is_available():
    print(f"GPU Available: {torch.cuda.get_device_name(0)}")
    print("CUDA is successfully enabled. Training will be accelerated.")
else:
    print("GPU NOT Available. Using CPU.")
    print("WARNING: For faster training, enable GPU in Runtime > Change runtime type > Hardware accelerator > T4 GPU.")
print("===========================================\n")

# Display NVIDIA System Management Interface details
!nvidia-smi""")

    # Cell 3
    add_code("""# 2. Environment Setup: Install Required Libraries
# Automatically installing ultralytics and necessary dependencies for visualization
!pip install -q ultralytics matplotlib opencv-python pyyaml

import ultralytics
print("Ultralytics Environment Checks:")
ultralytics.checks()""")

    # Cell 4
    add_code("""# 3. Upload and Extract Dataset
# Since your dataset is on your laptop, we will extract it here.
import os

print("Please zip your 'dataset' folder into 'dataset.zip'.")
print("Upload 'dataset.zip' using the file browser on the left sidebar of Google Colab.")
print("Once uploaded, run this cell to extract it.")

if os.path.exists('/content/dataset.zip'):
    print("Extracting dataset.zip...")
    !unzip -q -o /content/dataset.zip -d /content/
    print("Extraction complete!")
else:
    print("Warning: dataset.zip not found in /content/. Please upload it via the left sidebar.")
""")

    # Cell 5
    add_markdown("""### Dataset Configuration
Ensure your extracted `dataset.zip` follows this exact YOLO structure:
```text
/content/dataset/
 ├── images/
 │   ├── train/
 │   ├── val/
 │   └── test/
 ├── labels/
 │   ├── train/
 │   ├── val/
 │   └── test/
 └── data.yaml
```""")

    # Cell 6
    add_code("""# 4. Verify Dataset Paths
dataset_path = '/content/dataset'
data_yaml_path = f'{dataset_path}/data.yaml'

print("Verifying Dataset Structure...")
if os.path.exists(data_yaml_path):
    print(f"[SUCCESS] data.yaml found at: {data_yaml_path}")
    
    # Read and verify the data.yaml contents
    with open(data_yaml_path, 'r') as f:
        print("\\n--- data.yaml configuration ---")
        print(f.read())
        print("-------------------------------")
else:
    print(f"[ERROR] data.yaml NOT found at {data_yaml_path}.")
    print("Please verify that your dataset extracted correctly into /content/dataset.")""")

    # Cell 7
    add_code("""# 5. Visualize Sample Images with Ground Truth Labels
import cv2
import matplotlib.pyplot as plt
import glob

# Map class IDs to human-readable names
classes = {
  0: 'Yellow_Rust', 1: 'Brown_Rust', 2: 'Leaf_Blight', 3: 'Healthy', 4: 'Ear_Cockle', 
  5: 'Foot_Rot', 6: 'Karnal_Bunt', 7: 'Powdery_Mildew', 8: 'Smut_of_Wheat', 9: 'Stem_Rust'
}

# Fetch training images
train_images = glob.glob(f"{dataset_path}/images/train/*.jpg") + glob.glob(f"{dataset_path}/images/train/*.png")

if train_images:
    # Select the first sample image
    sample_image_path = train_images[0]
    sample_label_path = sample_image_path.replace('images', 'labels').replace('.jpg', '.txt').replace('.png', '.txt')
    
    # Load image using OpenCV
    img = cv2.imread(sample_image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    h, w, _ = img.shape
    
    # Parse YOLO annotation format and draw bounding boxes
    if os.path.exists(sample_label_path):
        with open(sample_label_path, 'r') as f:
            lines = f.readlines()
            for line in lines:
                class_id, x_center, y_center, width, height = map(float, line.strip().split())
                
                # Unnormalize coordinates
                x1 = int((x_center - width/2) * w)
                y1 = int((y_center - height/2) * h)
                x2 = int((x_center + width/2) * w)
                y2 = int((y_center + height/2) * h)
                
                # Draw Rectangle and Text
                cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 0), 2)
                cv2.putText(img, classes[int(class_id)], (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 0, 0), 2)
                
    # Display the plot
    plt.figure(figsize=(10, 8))
    plt.imshow(img)
    plt.title("Ground Truth Visualization (Sample Train Image)")
    plt.axis('off')
    plt.show()
else:
    print("[WARNING] No training images found. Please verify the dataset path.")""")

    # Cell 8
    add_code("""# 6. Model Initialization and Training Execution
from ultralytics import YOLO

print("Initializing Pre-trained YOLOv8 Nano Model...")
model = YOLO('yolov8n.pt') # Load YOLOv8n (nano) architecture

# Define project directory inside Colab to preserve weights temporarily
project_path = '/content/YOLO_Wheat_Models'
run_name = 'train_yolov8n_50epochs'

print("Starting Model Training...")
print("Configuration: 50 Epochs, Image Size 640x640, Batch Size 16")

# Start training process
results = model.train(
    data=data_yaml_path,
    epochs=50,
    imgsz=640,
    batch=16,
    project=project_path,
    name=run_name,
    exist_ok=True # Overwrite directory if it already exists
)""")

    # Cell 9
    add_code("""# 7. Model Validation
print("Running Validation on Validation Dataset...")
# YOLOv8 automatically evaluates on the validation split defined in data.yaml
val_results = model.val()""")

    # Cell 10
    add_code("""# 8. Visualization of Evaluation Metrics (Loss Curves, Precision, Recall, mAP, Confusion Matrix)
from IPython.display import Image, display

run_dir = f"{project_path}/{run_name}"

print("\\n" + "="*50)
print("TRAINING METRICS AND LOSS CURVES")
print("="*50)
display(Image(filename=f'{run_dir}/results.png', width=1000))

print("\\n" + "="*50)
print("CONFUSION MATRIX")
print("="*50)
display(Image(filename=f'{run_dir}/confusion_matrix.png', width=800))

print("\\n" + "="*50)
print("PRECISION-RECALL CURVE")
print("="*50)
display(Image(filename=f'{run_dir}/PR_curve.png', width=800))""")

    # Cell 11
    add_code("""# 9. Inference on Custom Test Image Uploads
from google.colab import files
import shutil

print("--- UPLOAD TEST IMAGE FOR INFERENCE ---")
print("Please upload an image of a wheat leaf to test the model...")
uploaded = files.upload()

if uploaded:
    # Extract filename
    test_image_name = list(uploaded.keys())[0]
    print(f"\\nRunning prediction on '{test_image_name}'...")
    
    # Load the best trained weights
    best_weights_path = f"{run_dir}/weights/best.pt"
    best_model = YOLO(best_weights_path)
    
    # Run inference prediction
    inference_results = best_model.predict(source=test_image_name, save=True, conf=0.25)
    
    # YOLO automatically saves predictions inside the default runs folder in the Colab instance
    predict_dir = inference_results[0].save_dir
    predicted_img_path = f"{predict_dir}/{test_image_name}"
    
    # Display the output image with bounding boxes
    img = cv2.imread(predicted_img_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    plt.figure(figsize=(12, 10))
    plt.imshow(img)
    plt.title("Model Prediction Output")
    plt.axis('off')
    plt.show()
    
    # Print numerical detection results
    print("\\n--- Inference Results Breakdown ---")
    boxes_detected = inference_results[0].boxes
    if len(boxes_detected) == 0:
        print("No diseases detected in the image.")
    else:
        for i, box in enumerate(boxes_detected):
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])
            disease_name = best_model.names[class_id]
            print(f"Detection [{i+1}]: {disease_name} (Confidence: {confidence:.2%})")""")

    # Cell 12
    add_code("""# 10. Final Summary and Model Download
from google.colab import files

print("\\n" + "*"*60)
print("            TRAINING COMPLETED SUCCESSFULLY")
print("*"*60)

print(f"\\n[1] Model Save Location (Colab Storage):")
print(f"    {best_weights_path}")

print("\\n[2] Final Evaluation Metrics Summary:")
map50 = val_results.box.map50
map95 = val_results.box.map
print(f"    - mAP@50:    {map50:.4f}")
print(f"    - mAP@50-95: {map95:.4f}")

# Trigger automatic download to the user's local machine
print("\\n[3] Initiating local download for 'best.pt'...")
files.download(best_weights_path)""")

    with open(r'e:\react\Wheat_Disease_YOLOv8_Colab.ipynb', 'w', encoding='utf-8') as f:
        json.dump(notebook, f, indent=2)
    print("Notebook successfully created.")

if __name__ == "__main__":
    create_notebook()
