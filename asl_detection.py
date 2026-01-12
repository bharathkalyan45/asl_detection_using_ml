import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, Sequential
from PIL import Image
import os
import numpy as np
import glob

data_path = "C:\\Users\\BHARATH\\Desktop\\Unified_Mentor\\asl_alphabet_train"

classes = sorted(os.listdir(data_path))

print(f"Number of Classes: {len(classes)} \nClasses : {classes}")

# total number of images per each train class

X = []
Y = []

for cls in classes:
    folder_path = os.path.join(data_path, cls)

    for files in glob.glob(folder_path + "\\*.*"):
        img = Image.open(files).resize((64, 64))
        X.append(np.array(img))
        Y.append(cls.replace(".jpg", ""))

print(f"Length of X: {len(X)}, Length of Y: {len(Y)}")

from sklearn.preprocessing import LabelEncoder

label = LabelEncoder()

Y = label.fit_transform(Y)

X = np.array(X)
Y = np.array(Y)

print("shape of X:", X.shape)

print("shape of Y:", Y.shape)

import matplotlib.pyplot as plt

plt.figure(figsize=(2, 2))
plt.imshow(X[0])
plt.axis(False)
plt.show()

# normalisation

X = X.astype(np.float32) / 255.0

from sklearn.model_selection import train_test_split

X_train, X_test, Y_train, Y_test = train_test_split(X, Y, train_size=0.7, random_state=42)

from keras.layers import Conv2D, MaxPooling2D

model = Sequential([

    layers.Conv2D(32, (5, 5), input_shape=(X_train.shape[1:]), activation='relu'),
    layers.MaxPooling2D(2, 2),

    layers.Conv2D(64, (5, 5), activation='relu'),
    layers.MaxPooling2D(2, 2),

    layers.Conv2D(128, (5, 5), activation='relu'),
    layers.MaxPooling2D(2, 2),

    layers.Flatten(),
    layers.Dense(256, activation='relu'),
    layers.Dense(29, activation="softmax")
])

model.summary()

from tensorflow.keras.callbacks import EarlyStopping

early_stop = EarlyStopping(monitor='val_loss', patience=2)

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

model.fit(X_train, Y_train,
          epochs=50,
          batch_size=64,
          validation_data=(X_test, Y_test),
          callbacks=[early_stop])

model.evaluate(X_test, Y_test)

preds = model.predict(X_test)

length = 16
no_columns = 4
no_rows = (length + no_columns - 1) // no_columns

plt.figure(figsize=(15, 15))
plt.subplots_adjust(wspace=0.1, hspace=0.3)

for i in range(length):

    actual = Y_test[i]
    predicted = np.argmax(preds[i])

    predicted_class = classes[predicted]
    actual_class = classes[actual]

    plt.subplot(no_rows, no_columns, i + 1)
    plt.imshow(X_test[i])
    plt.axis("off")

    if actual == predicted:
        plt.title(f"Actual: {actual_class}\n Predicted: {predicted_class}", color='Green')
    else:
        plt.title(f"Actual: {actual_class}\n Predicted: {predicted_class}", color='red')


plt.tight_layout()

from sklearn.metrics import confusion_matrix
import seaborn as sns
import numpy as np

y_pred = np.argmax(preds, axis=1)

cm = confusion_matrix(Y_test, y_pred)

plt.figure(figsize=(12, 10))
sns.heatmap(cm, annot=True, fmt="d", xticklabels=classes, yticklabels=classes)

plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.show()

model.save("asl_cnn_model.h5")

import joblib
joblib.dump(label, "label_encoder.pkl")
