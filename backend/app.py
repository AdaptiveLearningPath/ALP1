import torch
import torch.nn.functional as F
import torch.nn as nn
import cv2
import time
import numpy as np
from PIL import Image
from transformers import AutoFeatureExtractor, AutoModelForImageClassification
from adaptive_transformer import AdaptiveTransformer  # Ensure this is the correct import
import os

# === CONFIG ===
SNAP_INTERVAL = 5  # seconds
NUM_SNAPSHOTS = 20
TARGET_LABELS = ['angry', 'happy', 'neutral', 'sad', 'surprise']
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# === Load ViT model ===
feature_extractor = AutoFeatureExtractor.from_pretrained("trpakov/vit-face-expression")
vit_model = AutoModelForImageClassification.from_pretrained("trpakov/vit-face-expression").to(device)
vit_model.eval()

# === Load Transformer Model ===
transformer_model = AdaptiveTransformer().to(device)
state_dict = torch.load("adaptive_transformer_model.pkl", map_location=device)
transformer_model.load_state_dict(state_dict)
transformer_model.eval()

# === Capture Snapshots ===
cap = cv2.VideoCapture(0)
snapshots = []
start_time = time.time()
print("🟢 Capturing snapshots every 5 seconds. Press 'q' to quit early...")

while len(snapshots) < NUM_SNAPSHOTS and cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    elapsed = time.time() - start_time
    if elapsed >= SNAP_INTERVAL:
        start_time = time.time()
        snapshots.append(frame.copy())
        print(f"✅ Snapshot {len(snapshots)} captured")
    cv2.imshow("ViT Expression Tracker", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

# === Run Expression Inference ===
print("\n🔍 Running expression predictions...")
all_probs = []
for img_np in snapshots:
    img_pil = Image.fromarray(cv2.cvtColor(img_np, cv2.COLOR_BGR2RGB))
    inputs = feature_extractor(images=img_pil, return_tensors="pt").to(device)
    with torch.no_grad():
        outputs = vit_model(**inputs)
        probs = F.softmax(outputs.logits, dim=1).cpu().numpy()[0]
        all_probs.append(probs)

avg_probs = np.mean(all_probs, axis=0)
label_map = vit_model.config.id2label
expression_probs = {label_map[i].lower(): prob for i, prob in enumerate(avg_probs)}
filtered_probs = [expression_probs[label] for label in TARGET_LABELS]

# === Example Score Input from Frontend (replace with real-time value)
score = 0.75  # This value should be fetched from frontend input

# === Transformer Inference ===
input_tensor = torch.tensor(filtered_probs + [score], dtype=torch.float32).to(device)
with torch.no_grad():
    output = transformer_model(input_tensor.unsqueeze(0))  # shape: (1, 5, 3)
    predicted_classes = torch.argmax(output, dim=2).cpu().numpy()[0]

# === Output
print("\n📘 Predicted Learning Path (Difficulty Levels per Question):")
for i, level in enumerate(predicted_classes):
    print(f"Question {i+1}: Difficulty Level {level}")

import sys
import json
import torch
import numpy as np
from adaptive_transformer import AdaptiveTransformer

# Load model
model = AdaptiveTransformer()
model.load_state_dict(torch.load('path_to_model.pth', map_location=torch.device('cpu')))
model.eval()

# Read JSON from stdin
input_data = json.load(sys.stdin)
# Convert to tensor
input_tensor = torch.tensor(input_data, dtype=torch.float32).unsqueeze(0)  # (1, 5, 6)

# Run prediction
with torch.no_grad():
    output = model(input_tensor)  # shape: [1, 5, 3]
    predicted = torch.argmax(output, dim=-1).squeeze().tolist()  # shape: [5]

print(json.dumps({'learning_path': predicted}))

# import torch
# import torch.nn.functional as F
# import torch.nn as nn
# import cv2
# import time
# import numpy as np
# from PIL import Image
# from transformers import AutoFeatureExtractor, AutoModelForImageClassification
# from adaptive_transformer import AdaptiveTransformer  # Ensure this is the correct import
# import os

# # === CONFIG ===
# SNAP_INTERVAL = 5  # seconds
# NUM_SNAPSHOTS = 20
# TARGET_LABELS = ['angry', 'happy', 'neutral', 'sad', 'surprise']
# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# # === Load ViT model ===
# feature_extractor = AutoFeatureExtractor.from_pretrained("trpakov/vit-face-expression")
# vit_model = AutoModelForImageClassification.from_pretrained("trpakov/vit-face-expression").to(device)
# vit_model.eval()

# # === Load Transformer Model ===
# transformer_model = AdaptiveTransformer().to(device)
# state_dict = torch.load("adaptive_transformer_model.pkl", map_location=device)
# transformer_model.load_state_dict(state_dict)
# transformer_model.eval()

# # === Capture Snapshots ===
# cap = cv2.VideoCapture(0)
# snapshots = []
# start_time = time.time()
# print("🟢 Capturing snapshots every 5 seconds. Press 'q' to quit early...")

# while len(snapshots) < NUM_SNAPSHOTS and cap.isOpened():
#     ret, frame = cap.read()
#     if not ret:
#         break
#     elapsed = time.time() - start_time
#     if elapsed >= SNAP_INTERVAL:
#         start_time = time.time()
#         snapshots.append(frame.copy())
#         print(f"✅ Snapshot {len(snapshots)} captured")
#     cv2.imshow("ViT Expression Tracker", frame)
#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break

# cap.release()
# cv2.destroyAllWindows()

# # === Run Expression Inference ===
# print("\n🔍 Running expression predictions...")
# all_probs = []
# for img_np in snapshots:
#     img_pil = Image.fromarray(cv2.cvtColor(img_np, cv2.COLOR_BGR2RGB))
#     inputs = feature_extractor(images=img_pil, return_tensors="pt").to(device)
#     with torch.no_grad():
#         outputs = vit_model(**inputs)
#         probs = F.softmax(outputs.logits, dim=1).cpu().numpy()[0]
#         all_probs.append(probs)

# avg_probs = np.mean(all_probs, axis=0)
# label_map = vit_model.config.id2label

# # Print all expressions with their probabilities
# print("\n📊 Final Expression Probabilities (Averaged over all snapshots):")
# expression_probs = {label_map[i].lower(): prob for i, prob in enumerate(avg_probs)}

# print("\n🧠 Final Expression Probabilities (Filtered):")
# filtered_probs = []
# for label in TARGET_LABELS:
#     prob = expression_probs.get(label, 0.0)
#     filtered_probs.append(prob)
#     print(f"{label.capitalize()}: {prob:.4f}")


# # === Filter Probabilities Based on Target Labels ===
# filtered_probs = [expression_probs[label]*100 for label in TARGET_LABELS]

# # === Example Score Input from Frontend (replace with real-time value) ===
# score = 0  # This value should be fetched from frontend input

# # === Transformer Inference ===
# input_tensor = torch.tensor(filtered_probs + [score], dtype=torch.float32).to(device)
# with torch.no_grad():
#     output = transformer_model(input_tensor.unsqueeze(0))  # shape: (1, 5, 3)
#     predicted_classes = torch.argmax(output, dim=2).cpu().numpy()[0]

# # === Output ===
# print("\n📘 Predicted Learning Path (Difficulty Levels per Question):")
# for i, level in enumerate(predicted_classes):
#     print(f"Question {i+1}: Difficulty Level {level}")
