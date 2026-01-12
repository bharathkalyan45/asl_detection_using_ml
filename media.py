import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf
from PIL import Image

model = tf.keras.models.load_model("asl_cnn_model.h5")

classes = sorted([
    'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O',
    'P','Q','R','S','T','U','V','W','X','Y','Z','del','nothing','space'
])

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.75,
    min_tracking_confidence=0.75
)
mp_draw = mp.solutions.drawing_utils

PADDING = 40
IMG_SIZE = 64
CONF_THRESHOLD = 0.5


CAPTURE_BTN = (20, 20, 130, 55)
QUIT_BTN    = (140, 20, 240, 55)

hand_crop = None
captured_result = ""

last_live_class = None
last_live_conf = 0.0

def mouse_click(event, x, y, flags, param):
    global captured_result

    if event == cv2.EVENT_LBUTTONDOWN:

        # CAPTURE button
        if CAPTURE_BTN[0] < x < CAPTURE_BTN[2] and CAPTURE_BTN[1] < y < CAPTURE_BTN[3]:
            if last_live_class is not None:
                captured_result = f"{last_live_class} ({last_live_conf:.2f})"

        # QUIT button
        if QUIT_BTN[0] < x < QUIT_BTN[2] and QUIT_BTN[1] < y < QUIT_BTN[3]:
            cap.release()
            cv2.destroyAllWindows()
            exit()

cap = cv2.VideoCapture(0)
cv2.namedWindow("ASL Recognition")
cv2.setMouseCallback("ASL Recognition", mouse_click)

print("[INFO] Use mouse buttons: CAPTURE / QUIT")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    h, w, _ = frame.shape
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = hands.process(rgb)

    live_label = "No Hand"
    hand_crop = None

    if result.multi_hand_landmarks:
        for hand_landmarks in result.multi_hand_landmarks:

            x_min, y_min = w, h
            x_max, y_max = 0, 0

            for lm in hand_landmarks.landmark:
                x, y = int(lm.x * w), int(lm.y * h)
                x_min, y_min = min(x, x_min), min(y, y_min)
                x_max, y_max = max(x, x_max), max(y, y_max)

            x_min = max(0, x_min - PADDING)
            y_min = max(0, y_min - PADDING)
            x_max = min(w, x_max + PADDING)
            y_max = min(h, y_max + PADDING)

            if (x_max - x_min) < 120 or (y_max - y_min) < 120:
                continue

            hand_crop = frame[y_min:y_max, x_min:x_max]

            img = cv2.cvtColor(hand_crop, cv2.COLOR_BGR2RGB)
            img = Image.fromarray(img).resize((IMG_SIZE, IMG_SIZE))
            img = np.array(img).astype(np.float32) / 255.0
            img = np.expand_dims(img, axis=0)

            preds = model.predict(img, verbose=0)[0]
            conf = np.max(preds)
            class_id = np.argmax(preds)

            if conf > CONF_THRESHOLD:
                live_label = f"{classes[class_id]} ({conf:.2f})"
                last_live_class = classes[class_id]
                last_live_conf = conf
            else:
                live_label = "Uncertain"

            cv2.rectangle(frame, (x_min, y_min), (x_max, y_max), (0,255,0), 2)
            cv2.putText(frame, live_label, (x_min, y_min - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,0), 2)

            mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

    cv2.rectangle(frame, CAPTURE_BTN[:2], CAPTURE_BTN[2:], (0,200,0), -1)
    cv2.putText(frame, "CAPTURE", (30, 45),
                cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255,255,255), 1)

    cv2.rectangle(frame, QUIT_BTN[:2], QUIT_BTN[2:], (0,0,200), -1)
    cv2.putText(frame, "QUIT", (160, 45),
                cv2.FONT_HERSHEY_SIMPLEX, 0.45 , (255,255,255), 1)

    if captured_result:
        cv2.putText(frame, f"Captured: {captured_result}",
                    (20, h - 20),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255,255,0), 2)

    cv2.imshow("ASL Recognition", frame)

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()
