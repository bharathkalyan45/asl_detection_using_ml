// ===============================
// REAL ASL Prediction via FastAPI
// ===============================

const API_URL = "/predict";

/**
 * Send image blob to FastAPI for prediction
 * @param {Blob} imageBlob
 * @returns {Object} { letter, confidence }
 */
async function predictFromAPI(imageBlob) {
    const formData = new FormData();
    formData.append("file", imageBlob);

    const response = await fetch(API_URL, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        throw new Error("Prediction API failed");
    }

    const data = await response.json();

    return {
        letter: data.prediction,
        confidence: data.confidence
    };
}

/**
 * Convert canvas to Blob and predict
 * @param {HTMLCanvasElement} canvas
 */
async function processCanvasFrame(canvas) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(async (blob) => {
            try {
                const result = await predictFromAPI(blob);
                resolve({
                    letter: result.letter,
                    confidence: result.confidence,
                    allPredictions: [
                        { letter: result.letter, confidence: result.confidence }
                    ]
                });
            } catch (err) {
                reject(err);
            }
        }, "image/jpeg");
    });
}

/**
 * Predict ASL letter from uploaded image
 * @param {string} imageDataURL
 */
async function predictASLLetter(imageBlob) {
    console.log("predict input:", imageBlob);

    const formData = new FormData();
    formData.append("file", imageBlob, "image.jpg");

    const res = await fetch("/predict", {
        method: "POST",
        body: formData
    });

    if (!res.ok) throw new Error("Prediction failed");

    const data = await res.json();

    return {
        letter: data.prediction,
        confidence: data.confidence,
        allPredictions: [
            { letter: data.prediction, confidence: data.confidence }
        ]
    };
}
/**
 * Available ASL classes (used by UI)
 */
function getASLClasses() {
    return [
        'A','B','C','D','E','F','G','H','I','J',
        'K','L','M','N','O','P','Q','R','S','T',
        'U','V','W','X','Y','Z',
        'space','delete','nothing'
    ];
}

/**
 * Validate image size
 */
function isValidImageDimensions(img) {
    return img.width >= 64 && img.height >= 64;
}
