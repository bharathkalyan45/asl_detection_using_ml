# ASL Alphabet Recognizer

A modern web application for recognizing American Sign Language (ASL) letters using image upload and live webcam capture. Built with pure HTML, CSS, and JavaScript.

## Features

- 📸 **Image Upload**: Upload ASL hand sign images for instant recognition
- 🎥 **Live Webcam Capture**: Real-time ASL letter detection from your webcam
- ✋ **29 Gesture Support**: Recognizes all 26 letters plus "del", "space", and "nothing"
- 📊 **Confidence Scores**: View prediction confidence percentages
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 🌓 **Dark Mode Support**: Automatic dark mode for supported browsers

## Project Structure

```
asl-recognition-app/
├── index.html                 # Main HTML file with structure
├── css/
│   ├── styles.css            # Main stylesheet and component styles
│   └── responsive.css        # Responsive design breakpoints
├── js/
│   ├── app.js                # Main app controller and initialization
│   ├── uploader.js           # Image upload handling and preview
│   ├── webcam.js             # Webcam capture and streaming
│   ├── prediction.js         # ASL prediction engine
│   └── ui.js                 # UI utilities and helpers
└── README.md                 # This file
```

## How It Works

### Image Upload
1. Click the upload area or drag & drop an image
2. Preview appears with a "Recognize Letter" button
3. Click to analyze the image
4. View results with confidence scores
5. See top 5 predictions for the detected gesture

### Live Webcam Capture
1. Click "Start Webcam" to begin capturing
2. Real-time detection shows current predicted letter
3. Click "Capture" to save and analyze current frame
4. View results with full prediction breakdown
5. Click "Capture Again" to try another gesture

## Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

### Browser Requirements
- Webcam/camera access (for live capture feature)
- JavaScript enabled
- Modern CSS Grid and Flexbox support

## Installation

### Option 1: Local Development
1. Clone or download this repository
2. Open `index.html` in a web browser
3. For webcam functionality, serve over HTTPS or localhost

### Option 2: Using Python's built-in server
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser

### Option 3: Using Node.js http-server
```bash
npx http-server
```

## Usage

### Image Upload
- Supports JPG, PNG, WebP, and other common image formats
- Recommended image size: 64x64 pixels (will be resized)
- Works with any hand sign image

### Webcam Capture
- Requires browser permissions for camera access
- Works best in well-lit environments
- Real-time detection updates every 3 frames
- Captured images are processed locally (no server upload)

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Flexbox, Grid, Variables, Media Queries
- **JavaScript (ES6+)**: Modular architecture
- **Canvas API**: Image processing
- **getUserMedia API**: Webcam access

### Performance Optimization
- Lazy loading for images
- Debounced/throttled event listeners
- Optimized canvas rendering
- LocalStorage for user preferences
- Reduced motion support for accessibility

### Accessibility Features
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast mode support
- Screen reader friendly

## Customization

### Modify Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
    --primary-color: #7c3aed;
    --secondary-color: #3b82f6;
    --success-color: #10b981;
    /* ... more variables ... */
}
```

### Change Supported Gestures
Edit the `ASL_CLASSES` array in `js/prediction.js`:
```javascript
const ASL_CLASSES = [
    'A', 'B', 'C', 'D', 'E', // ... modify as needed
];
```

### Adjust Prediction Sensitivity
Modify confidence thresholds in `js/prediction.js`:
```javascript
confidence = 0.65 + (random * 0.3); // Adjust min/max values
```

## Limitations

- This uses a **mock prediction engine** for demonstration
- To use the actual ASL CNN model:
  1. Train/export your TensorFlow model
  2. Convert to TensorFlow.js or ONNX format
  3. Load the model in `prediction.js`
  4. Replace the mock prediction logic

### Example TensorFlow.js Integration
```javascript
let model;

async function loadModel() {
    model = await tf.loadLayersModel('path/to/model.json');
}

async function predictASLLetter(canvas) {
    const img = tf.browser.fromPixels(canvas)
        .resizeNearestNeighbor([64, 64])
        .toFloat()
        .div(255.0);
    
    const prediction = await model.predict(img.expandDims(0));
    // Process and return results
}
```

## Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Enable GitHub Pages in settings
3. Deploy from main branch
4. Access at: `https://username.github.io/repo-name`

### Netlify
1. Drag and drop folder to Netlify
2. Or connect GitHub repository
3. Automatic deployments on push
4. Custom domain available

### Vercel
```bash
npm i -g vercel
vercel
```

### Traditional Hosting
1. Upload all files to web host
2. Ensure `index.html` is in root directory
3. For webcam: ensure HTTPS is enabled

## Performance Tips

1. **Optimize Images**: Compress before upload
2. **Cache Results**: Use LocalStorage for recent predictions
3. **Reduce Webcam Resolution**: 640x480 is sufficient
4. **Lazy Load Assets**: Load libraries only when needed

## Troubleshooting

### Webcam Not Working
- Check browser permissions
- Ensure HTTPS (required for most modern browsers)
- Try a different browser
- Close other applications using the camera

### Predictions Inaccurate
- Ensure good lighting conditions
- Keep hand in clear view
- Position hand similar to training data
- Try multiple angles

### Slow Performance
- Close unnecessary browser tabs
- Reduce video resolution
- Use a faster device
- Check network connection

## Browser Console Errors

**"getUserMedia is not supported"**
- Update your browser
- Use HTTPS connection
- Try a different browser

**"Canvas cross-origin error"**
- Ensure images are from same origin
- Use data URLs for local images
- Configure CORS if needed

## Privacy & Data

- ✅ All processing happens locally in your browser
- ✅ No data sent to external servers
- ✅ Webcam frames not recorded or stored
- ✅ Images not saved without your action

## Future Enhancements

- [ ] Real TensorFlow.js model integration
- [ ] Multiple hand detection
- [ ] Hand pose visualization
- [ ] Gesture sequencing (spell words)
- [ ] Confidence filtering options
- [ ] Download prediction history
- [ ] Batch image processing
- [ ] Video file upload support
- [ ] Custom model training UI
- [ ] Voice-over feedback for accessibility

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Support

For issues, questions, or suggestions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify browser compatibility
4. Test with different images/angles

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Author**: ASL Recognition Team
