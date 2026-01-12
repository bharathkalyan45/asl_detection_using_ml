let video = document.getElementById("webcamVideo");
let canvas = document.getElementById("webcamCanvas");
let ctx = canvas.getContext("2d");
let stream = null;

/* ---------------- START WEBCAM ---------------- */
async function startWebcam() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false
        });

        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            draw();
        };

    } catch (err) {
        console.error("Webcam error:", err);
        alert("Please allow camera access!");
    }
}

/* ---------------- DRAW FRAME ---------------- */
function draw() {
    if (!stream) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    requestAnimationFrame(draw);
}

/* ---------------- STOP WEBCAM ---------------- */
function stopWebcam() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
}

/* ---------------- SHARED RESULT RENDERER ---------------- */
function renderResult(prediction, confidence) {
    const resultPanel = document.getElementById("result-panel");

    resultPanel.innerHTML = `
        <div class="prediction-card">
            <h3>PREDICTED LETTER</h3>

            <div class="predicted-letter">
                ${prediction}
            </div>

            <div class="confidence-text">
                ${(confidence * 100).toFixed(1)}%
            </div>

            <div class="progress-bar">
                <div class="progress-fill"
                     style="width:${confidence * 100}%">
                </div>
            </div>
        </div>
    `;
}

/* ---------------- CALL BACKEND ---------------- */
async function predictWebcamAPI(blob)  {
    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");

    const response = await fetch("/predict", {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        throw new Error("Prediction failed");
    }

    return await response.json();
}

/* ---------------- CAPTURE FRAME ---------------- */
async function captureFrame() {
    canvas.toBlob(async (blob) => {
        try {
            const result = await predictWebcamAPI(blob);

            // Optional confidence gate
            if (result.confidence < 0.6) {
                renderResult("Unknown", result.confidence);
            } else {
                renderResult(result.prediction, result.confidence);
            }
            document.getElementById("webcamPlaceholder").style.display = "none";

        } catch (err) {
            console.error(err);
            alert("Prediction failed");
        }
    }, "image/jpeg");
}
