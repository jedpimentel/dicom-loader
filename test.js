const dicom = require('./build/Release/dicom_loader');

const image = dicom.loadDicom("src/test.dcm");

if (image) {
    console.log("✅ DICOM Image Loaded Successfully!");
    console.log("Width:", image.width);
    console.log("Height:", image.height);
    console.log("Depth:", image.depth);
    console.log("Pixel Data Length:", image.pixelData.length);
} else {
    console.log("❌ Failed to load DICOM image.");
}