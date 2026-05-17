@echo off
echo Starting YOLOv8 training for Wheat Disease Detection...
cd e:\react\dataset

:: Ensure ultralytics is installed
python -m pip install ultralytics

:: Run YOLOv8 training
yolo detect train data=data.yaml model=yolov8n.pt epochs=50 imgsz=640

echo Training completed!
echo Your best model is located at: runs\detect\train\weights\best.pt
echo Training metrics can be found in: runs\detect\train\results.csv
pause
