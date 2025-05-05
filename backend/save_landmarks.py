# save_landmarks.py
import cv2
import mediapipe as mp
import time

# Initialize FaceMesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(max_num_faces=1, refine_landmarks=True)

# Open webcam
cap = cv2.VideoCapture(0)
file_path = "landmarks.txt"
start_time = time.time()

print("🔵 Capturing features every 5 seconds. Press 'q' to quit.")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Convert frame to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_frame)

    # Draw face mesh
    if results.multi_face_landmarks:
        for landmarks in results.multi_face_landmarks:
            for landmark in landmarks.landmark:
                h, w, _ = frame.shape
                x, y = int(landmark.x * w), int(landmark.y * h)
                cv2.circle(frame, (x, y), 1, (0, 255, 0), -1)

            # Capture every 5 seconds
            current_time = time.time()
            if current_time - start_time >= 5:
                start_time = current_time
                points = [f"{landmark.x},{landmark.y}" for landmark in landmarks.landmark]
                with open(file_path, "a") as file:
                    file.write(",".join(points) + "\n")
                print("✅ Features saved to landmarks.txt")

    # Display frame
    cv2.imshow("Face Mesh Feature Extraction", frame)

    # Quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
print("✅ Capture complete. Check 'landmarks.txt'")

