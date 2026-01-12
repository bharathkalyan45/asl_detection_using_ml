// Image Uploader Module – FINAL FIXED VERSION (Canvas → Blob)
class ImageUploader {
    constructor() {
        this.currentImage = null;
        this.currentPrediction = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const uploadArea = document.getElementById("uploadArea");
        const fileInput = document.getElementById("fileInput");
        const recognizeBtn = document.getElementById("recognizeBtn");
        const clearImageBtn = document.getElementById("clearImageBtn");
        const uploadAnotherBtn = document.getElementById("uploadAnotherBtn");

        if (!uploadArea || !fileInput) {
            console.error("❌ Upload elements missing in DOM");
            return;
        }

        /* ✅ CLICK TO OPEN FILE */
        uploadArea.addEventListener("click", () => {
            fileInput.click();
        });

        /* ✅ FILE SELECTION */
        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith("image/")) {
                this.handleFile(file);
            }
        });

        /* ✅ DRAG & DROP */
        uploadArea.addEventListener("dragover", (e) => e.preventDefault());

        uploadArea.addEventListener("drop", (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
                this.handleFile(file);
            }
        });

        /* ✅ RECOGNIZE */
        if (recognizeBtn) {
            recognizeBtn.addEventListener("click", () => this.recognize());
        }

        /* ✅ CLEAR */
        if (clearImageBtn) {
            clearImageBtn.addEventListener("click", () => this.clearImage());
        }

        if (uploadAnotherBtn) {
            uploadAnotherBtn.addEventListener("click", () => this.clearImage());
        }
    }

    handleFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentImage = e.target.result;
            this.showPreview();
        };
        reader.readAsDataURL(file);
    }

    showPreview() {
        const uploadArea = document.getElementById("uploadArea");
        const previewContainer = document.getElementById("previewContainer");
        const previewImage = document.getElementById("previewImage");
        const recognizeBtn = document.getElementById("recognizeBtn");

        previewImage.src = this.currentImage;
        uploadArea.style.display = "none";
        previewContainer.style.display = "block";
        recognizeBtn.style.display = "block";

        this.clearResults();
    }

    async recognize() {
        if (!this.currentImage) return;

        if (window.app && window.app.showLoading) {
            window.app.showLoading(true);
        }

        try {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                /* ✅ CANVAS → BLOB */
                canvas.toBlob(async (blob) => {
                    try {
                        console.log("📤 Uploading blob:", blob);

                        const prediction = await predictASLLetter(blob);
                        this.currentPrediction = prediction;
                        this.displayResults();
                    } catch (err) {
                        console.error("❌ Prediction failed:", err);
                        alert("Prediction failed");
                    } finally {
                        if (window.app && window.app.showLoading) {
                            window.app.showLoading(false);
                        }
                    }
                }, "image/jpeg");
            };

            img.src = this.currentImage;

        } catch (err) {
            console.error("❌ Recognition error:", err);
            if (window.app && window.app.showLoading) {
                window.app.showLoading(false);
            }
        }
    }

    displayResults() {
        if (!this.currentPrediction) return;

        document.getElementById("predictedLetter").textContent =
            this.currentPrediction.letter;

        document.getElementById("predictedConfidence").textContent =
            (this.currentPrediction.confidence * 100).toFixed(1) + "%";

        document.getElementById("confidenceFill").style.width =
            (this.currentPrediction.confidence * 100) + "%";

        const list = document.getElementById("allPredictions");
        list.innerHTML = "";

        this.currentPrediction.allPredictions.forEach((p) => {
            const div = document.createElement("div");
            div.className = "prediction-item";
            div.innerHTML = `
                <div>${p.letter}</div>
                <div>${(p.confidence * 100).toFixed(1)}%</div>
            `;
            list.appendChild(div);
        });

        document.getElementById("uploadResultsContainer").style.display = "block";
        document.getElementById("uploadPlaceholder").style.display = "none";
        document.getElementById("recognizeBtn").style.display = "none";
    }

    clearResults() {
        document.getElementById("uploadResultsContainer").style.display = "none";
        document.getElementById("uploadPlaceholder").style.display = "block";
        this.currentPrediction = null;
    }

    clearImage() {
        this.currentImage = null;

        document.getElementById("upload-tab").classList.add("active");

        document.getElementById("uploadArea").style.display = "block";
        document.getElementById("previewContainer").style.display = "none";
        document.getElementById("recognizeBtn").style.display = "none";
        document.getElementById("fileInput").value = "";

        this.clearResults();
    }
}

/* ✅ INIT */
document.addEventListener("DOMContentLoaded", () => {
    window.uploader = new ImageUploader();
});
