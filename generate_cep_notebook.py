import json

def create_notebook():
    notebook = {
        "cells": [],
        "metadata": {
            "colab": {"provenance": []},
            "kernelspec": {"display_name": "Python 3", "name": "python3"},
            "language_info": {"name": "python"}
        },
        "nbformat": 4,
        "nbformat_minor": 0
    }

    def add_markdown(text):
        notebook["cells"].append({"cell_type": "markdown", "metadata": {}, "source": [text]})

    def add_code(text):
        notebook["cells"].append({
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [line + "\n" if not line.endswith("\n") else line for line in text.split("\n")][:-1]
        })

    # Title Block (Milestone 3 Requirement)
    add_markdown("""# CS-436 Computer Vision: Complex Engineering Problem (CEP)
**Project Title:** AI-Based Wheat Disease Detection and Localization using Object Detection Models
**Group Members:**
1. [Name] - [Roll Number]
2. [Name] - [Roll Number]
3. [Name] - [Roll Number]
4. [Name] - [Roll Number]

**Task:** Object Detection (10 Classes)
""")

    # Setup
    add_code("""# 1. GPU Check & Environment Setup
import torch
print("GPU Available:", torch.cuda.is_available())
if torch.cuda.is_available():
    print("Device Name:", torch.cuda.get_device_name(0))

# Install dependencies (Ultralytics supports YOLOv8, YOLOv10, and RT-DETR natively!)
!pip install -q ultralytics ipywidgets matplotlib opencv-python pyyaml
import ultralytics
ultralytics.checks()
""")

    # Dataset Upload & Extract
    add_code("""# 2. Upload and Extract Dataset
import os
from google.colab import files

print("INSTRUCTIONS: Please zip your 'dataset' folder into 'dataset.zip' and upload it to the left sidebar.")
print("Once uploaded, run this cell to extract it.")

if os.path.exists('/content/dataset.zip'):
    print("Extracting dataset.zip...")
    !unzip -q -o /content/dataset.zip -d /content/
    print("Extraction complete!")
    dataset_path = '/content/dataset'
    data_yaml_path = f'{dataset_path}/data.yaml'
else:
    print("WARNING: dataset.zip not found! Please upload it.")
""")

    # EDA
    add_markdown("""### 3. Exploratory Data Analysis (EDA) & Preprocessing""")
    add_code("""import cv2
import matplotlib.pyplot as plt
import glob

# Visualize a sample image with bounding boxes
classes = {0: 'Yellow_Rust', 1: 'Brown_Rust', 2: 'Leaf_Blight', 3: 'Healthy', 4: 'Ear_Cockle', 
           5: 'Foot_Rot', 6: 'Karnal_Bunt', 7: 'Powdery_Mildew', 8: 'Smut_of_Wheat', 9: 'Stem_Rust'}

train_images = glob.glob(f"/content/dataset/images/train/*.jpg")
if train_images:
    sample_img = train_images[0]
    sample_lbl = sample_img.replace('images', 'labels').replace('.jpg', '.txt')
    
    img = cv2.imread(sample_img)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    h, w, _ = img.shape
    
    if os.path.exists(sample_lbl):
        with open(sample_lbl, 'r') as f:
            for line in f.readlines():
                cid, xc, yc, bw, bh = map(float, line.strip().split())
                x1, y1 = int((xc - bw/2)*w), int((yc - bh/2)*h)
                x2, y2 = int((xc + bw/2)*w), int((yc + bh/2)*h)
                cv2.rectangle(img, (x1,y1), (x2,y2), (255,0,0), 2)
                cv2.putText(img, classes[int(cid)], (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,0,0), 2)
                
    plt.figure(figsize=(8,8))
    plt.imshow(img)
    plt.title("Sample Train Image with Ground Truth Bounding Box")
    plt.axis('off')
    plt.show()
""")

    # Architecture Selection Justification
    add_markdown("""### 4. Selection of 3 Forefront Architectures
**Rationale for Selection:**
1. **YOLOv8n (CNN - Anchor-Free):** Serves as our lightweight, anchor-free CNN baseline. Known for excellent accuracy-speed trade-offs.
2. **YOLOv10n (CNN - NMS-Free):** Eliminates Non-Maximum Suppression (NMS), offering a fundamentally different detection head architecture than v8, optimizing inference latency.
3. **RT-DETR-L (Vision Transformer - ViT):** Represents a fundamentally different approach compared to CNNs. It uses self-attention mechanisms to capture global context across the entire wheat leaf image.
""")

    # Training Matrix Strategy
    add_markdown("""### 5. The 9-Model Hyperparameter Experiment Matrix
We systematically vary Optimizers, Learning Rates, and Batch Sizes based on first principles:
- **AdamW vs SGD:** Testing adaptive learning vs standard momentum.
- **Cosine Annealing (cos_lr):** Smoothly decaying learning rate to prevent getting stuck in local minima.
- **Batch Size:** Testing generalization (smaller batch sizes introduce noise acting as regularization).
""")

    # Training Scripts (YOLOv8)
    add_code("""from ultralytics import YOLO

# NOTE: For demonstration in this notebook, epochs are set to 5. 
# PLEASE CHANGE 'epochs=5' to 'epochs=50' FOR YOUR ACTUAL PROJECT RUN!

# ----------------- MODEL 1: YOLOv8n (CNN Anchor-Free) -----------------
print("Training Run 1.1: YOLOv8n | AdamW | LR=0.001 | Batch=16")
m1_1 = YOLO('yolov8n.pt')
m1_1.train(data=data_yaml_path, epochs=5, imgsz=640, batch=16, optimizer='AdamW', lr0=0.001, project='/content/CEP_Runs', name='yolov8_run1')

print("Training Run 1.2: YOLOv8n | SGD | LR=0.01 | Batch=16")
m1_2 = YOLO('yolov8n.pt')
m1_2.train(data=data_yaml_path, epochs=5, imgsz=640, batch=16, optimizer='SGD', lr0=0.01, project='/content/CEP_Runs', name='yolov8_run2')

print("Training Run 1.3: YOLOv8n | AdamW | LR=0.001 | Cosine LR | Batch=32")
m1_3 = YOLO('yolov8n.pt')
m1_3.train(data=data_yaml_path, epochs=5, imgsz=640, batch=32, optimizer='AdamW', lr0=0.001, cos_lr=True, project='/content/CEP_Runs', name='yolov8_run3')
""")

    # Training Scripts (YOLOv10)
    add_code("""# ----------------- MODEL 2: YOLOv10n (CNN NMS-Free) -----------------
print("Training Run 2.1: YOLOv10n | AdamW | LR=0.001 | Batch=16")
m2_1 = YOLO('yolov10n.pt')
m2_1.train(data=data_yaml_path, epochs=5, imgsz=640, batch=16, optimizer='AdamW', lr0=0.001, project='/content/CEP_Runs', name='yolov10_run1')

print("Training Run 2.2: YOLOv10n | SGD | LR=0.01 | Batch=16")
m2_2 = YOLO('yolov10n.pt')
m2_2.train(data=data_yaml_path, epochs=5, imgsz=640, batch=16, optimizer='SGD', lr0=0.01, project='/content/CEP_Runs', name='yolov10_run2')

print("Training Run 2.3: YOLOv10n | AdamW | LR=0.001 | Cosine LR | Batch=32")
m2_3 = YOLO('yolov10n.pt')
m2_3.train(data=data_yaml_path, epochs=5, imgsz=640, batch=32, optimizer='AdamW', lr0=0.001, cos_lr=True, project='/content/CEP_Runs', name='yolov10_run3')
""")

    # Training Scripts (RT-DETR)
    add_code("""# ----------------- MODEL 3: RT-DETR-L (Vision Transformer) -----------------
# Transformers require more memory, so we drop the batch size to 8.
print("Training Run 3.1: RT-DETR-L | AdamW | LR=0.0001 | Batch=8")
m3_1 = YOLO('rtdetr-l.pt')
m3_1.train(data=data_yaml_path, epochs=5, imgsz=640, batch=8, optimizer='AdamW', lr0=0.0001, project='/content/CEP_Runs', name='rtdetr_run1')

print("Training Run 3.2: RT-DETR-L | SGD | LR=0.001 | Batch=8")
m3_2 = YOLO('rtdetr-l.pt')
m3_2.train(data=data_yaml_path, epochs=5, imgsz=640, batch=8, optimizer='SGD', lr0=0.001, project='/content/CEP_Runs', name='rtdetr_run2')

print("Training Run 3.3: RT-DETR-L | AdamW | LR=0.0001 | Cosine LR | Batch=8")
m3_3 = YOLO('rtdetr-l.pt')
m3_3.train(data=data_yaml_path, epochs=5, imgsz=640, batch=8, optimizer='AdamW', lr0=0.0001, cos_lr=True, project='/content/CEP_Runs', name='rtdetr_run3')
""")

    # Evaluation Extractor
    add_code("""# 6. Comparative Analysis Table Generator
import pandas as pd
import os

print("Extracting mAP@[0.5:0.95] metrics from all 9 runs...")
# After training completes, you can extract the best.pt from each run and compile the results.
# Ultralytics saves the results to a results.csv in each run folder.

def extract_metrics(run_name):
    csv_path = f'/content/CEP_Runs/{run_name}/results.csv'
    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        # Get the row with the highest mAP50-95 (usually the last column)
        col_name = [c for c in df.columns if 'mAP50-95' in c.replace(' ', '')][0]
        best_mAP = df[col_name].max()
        return round(best_mAP, 4)
    return "N/A"

data = {
    "Run": ["1.1", "1.2", "1.3", "2.1", "2.2", "2.3", "3.1", "3.2", "3.3"],
    "Architecture": ["YOLOv8n", "YOLOv8n", "YOLOv8n", "YOLOv10n", "YOLOv10n", "YOLOv10n", "RT-DETR", "RT-DETR", "RT-DETR"],
    "Variations": ["AdamW, Batch 16", "SGD, Batch 16", "AdamW, Cosine, Batch 32", 
                   "AdamW, Batch 16", "SGD, Batch 16", "AdamW, Cosine, Batch 32",
                   "AdamW, Batch 8", "SGD, Batch 8", "AdamW, Cosine, Batch 8"],
    "mAP@[0.5:0.95]": [extract_metrics(f'yolov8_run{i}') for i in range(1,4)] + 
                      [extract_metrics(f'yolov10_run{i}') for i in range(1,4)] + 
                      [extract_metrics(f'rtdetr_run{i}') for i in range(1,4)]
}

results_df = pd.DataFrame(data)
display(results_df)
""")
    
    # Validation Plots
    add_code("""# 7. Validation & Failure Case Analysis
from IPython.display import Image, display
# Displaying the confusion matrix for the best model (assume yolov8_run1 for demo)
print("Confusion Matrix for Top Model:")
if os.path.exists('/content/CEP_Runs/yolov8_run1/confusion_matrix.png'):
    display(Image('/content/CEP_Runs/yolov8_run1/confusion_matrix.png', width=800))
""")

    # Interactive Colab Interface (Crucial for Marks)
    add_code("""# 8. Interactive Interface (As required by Syllabus)
import ipywidgets as widgets
from IPython.display import display, clear_output, Image as IPyImage
import time
from ultralytics import YOLO

# Load the single best model overall for inference
# We'll use YOLOv8 run 1 as the placeholder for the best model
try:
    best_model = YOLO('/content/CEP_Runs/yolov8_run1/weights/best.pt')
except:
    print("Train the model first to use the interface.")

upload_btn = widgets.FileUpload(accept='image/*', multiple=False, description='Upload Test Image')
output_display = widgets.Output()

def on_upload_change(change):
    with output_display:
        clear_output()
        if not upload_btn.value: return
        
        # In newer ipywidgets, the value is a tuple of dictionaries or directly dict
        uploaded_filename = list(upload_btn.value.keys())[0]
        content = upload_btn.value[uploaded_filename]['content']
        
        with open('temp_test.jpg', 'wb') as f:
            f.write(content)
            
        print("Running Inference...")
        start_time = time.time()
        res = best_model.predict('temp_test.jpg', save=True, conf=0.25)
        latency = (time.time() - start_time) * 1000
        
        saved_dir = res[0].save_dir
        print(f"Inference Latency: {latency:.2f} ms")
        display(IPyImage(filename=f"{saved_dir}/temp_test.jpg", width=600))

upload_btn.observe(on_upload_change, names='value')
print("--- Interactive Disease Detection System ---")
display(upload_btn, output_display)
""")

    with open(r'e:\react\CS22XXX_Wheat_Disease_CEP.ipynb', 'w', encoding='utf-8') as f:
        json.dump(notebook, f, indent=2)
    print("CEP Notebook successfully created.")

if __name__ == "__main__":
    create_notebook()
