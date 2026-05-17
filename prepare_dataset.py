import os
import glob
import random
import shutil

# Paths
source_dir = r"e:\react\Wheat_Disease Dataset\Wheat"
dataset_dir = r"e:\react\dataset"

# Classes mapping
classes_map = {
    "Wheat___Yellow_Rust": 0,
    "Wheat___Brown_Rust": 1,
    "Wheat___Leaf_Blight": 2,
    "Wheat___Healthy": 3,
    "Wheat___Ear_Cockle": 4,
    "Wheat___Foot_Rot": 5,
    "Wheat___Karnal_Bunt": 6,
    "Wheat___Powdery_Mildew": 7,
    "Wheat___Smut_of_Wheat": 8,
    "Wheat___Stem_Rust": 9
}

# Create directories
for split in ['train', 'val', 'test']:
    os.makedirs(os.path.join(dataset_dir, 'images', split), exist_ok=True)
    os.makedirs(os.path.join(dataset_dir, 'labels', split), exist_ok=True)

# Process images
all_images = []
for folder, class_id in classes_map.items():
    folder_path = os.path.join(source_dir, folder)
    if os.path.exists(folder_path):
        images = glob.glob(os.path.join(folder_path, '*.jpg')) + \
                 glob.glob(os.path.join(folder_path, '*.png')) + \
                 glob.glob(os.path.join(folder_path, '*.jpeg'))
        for img in images:
            all_images.append((img, class_id))

# Shuffle and split
random.seed(42)
random.shuffle(all_images)
total_len = len(all_images)
train_end = int(total_len * 0.8)
val_end = int(total_len * 0.9)

train_data = all_images[:train_end]
val_data = all_images[train_end:val_end]
test_data = all_images[val_end:]

def process_data(data, split):
    for img_path, class_id in data:
        filename = os.path.basename(img_path)
        base_name = os.path.splitext(filename)[0]
        
        # Avoid duplicate filenames by appending class_id
        new_filename = f"{base_name}_{class_id}.jpg"
        
        # Copy image
        dest_img = os.path.join(dataset_dir, 'images', split, new_filename)
        shutil.copy(img_path, dest_img)
        
        # Write label (Pseudo annotation: full image since it's a classification dataset)
        label_path = os.path.join(dataset_dir, 'labels', split, f"{base_name}_{class_id}.txt")
        with open(label_path, 'w') as f:
            f.write(f"{class_id} 0.5 0.5 0.9 0.9\n")

print(f"Processing Train: {len(train_data)}")
process_data(train_data, 'train')
print(f"Processing Val: {len(val_data)}")
process_data(val_data, 'val')
print(f"Processing Test: {len(test_data)}")
process_data(test_data, 'test')

# Create data.yaml
yaml_content = f"""path: {dataset_dir}
train: images/train
val: images/val
test: images/test

nc: 10
names:
  0: Yellow_Rust
  1: Brown_Rust
  2: Leaf_Blight
  3: Healthy
  4: Ear_Cockle
  5: Foot_Rot
  6: Karnal_Bunt
  7: Powdery_Mildew
  8: Smut_of_Wheat
  9: Stem_Rust
"""

with open(os.path.join(dataset_dir, 'data.yaml'), 'w') as f:
    f.write(yaml_content)

print("Dataset preparation complete.")
