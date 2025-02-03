const fs = require("fs");
const { exec } = require("child_process");
const WebSocket = require("ws");
const express = require("express");
const path = require("path");

const DICOM_FOLDER = "dicom-folder";
const app = express();
app.use(express.static("public"));


// ✅ Serve the `dicom-folder` as a public directory
app.use(`/${DICOM_FOLDER}`, express.static(path.join(__dirname, DICOM_FOLDER)));

// ✅ Endpoint to fetch DICOM file list
app.get("/dicom-list", (req, res) => {
  fs.readdir(DICOM_FOLDER, (err, files) => {
      if (err) {
          res.status(500).json({ error: "Failed to read DICOM folder" });
          return;
      }
      const dicomFiles = files.filter(file => file.endsWith(".dcm"));
      res.json({ files: dicomFiles.map(file => `/${DICOM_FOLDER}/${file}`) });
  });
});

app.listen(3000, () => console.log("🚀 Web server running on http://localhost:3000"));

// WebSocket Server
const wss = new WebSocket.Server({ port: 8080 });
console.log("📡 WebSocket server running on ws://localhost:8080");

// Broadcast function
function broadcast(data) {
  wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
      }
  });
}

// Extract and send DICOM pixel data
function sendDicomFiles() {
  fs.readdir(DICOM_FOLDER, (err, files) => {
    if (err) {
      console.error("❌ Error reading DICOM folder:", err);
      return;
    }

    files.filter(file => file.endsWith(".dcm")).forEach(file => {
      const dicomPath = path.join(DICOM_FOLDER, file);
      const decompressedDicomPath = `${dicomPath}.uncompressed.dcm`;

      // Extract Metadata
      exec(`dcmdump +P 0028,0010 +P 0028,0011 +P 0028,0100 +P 0002,0010 ${dicomPath}`, (metaErr, metaStdout) => {
        if (metaErr) {
          console.error(`❌ Failed to read DICOM metadata for ${file}:`, metaErr);
          return;
        }

        let width = 0, height = 0, bitsAllocated = 8, compressionFormat = "Uncompressed";
        const metadata = {};

        metaStdout.split("\n").forEach(line => {
            const match = line.match(/\((0028,0010|0028,0011|0028,0100|0002,0010)\) [A-Z]{2} (.+)/);
            if (match) {
                const tag = match[1];
                const value = match[2].trim();

                if (tag === "0028,0010") height = parseInt(value, 10);
                if (tag === "0028,0011") width = parseInt(value, 10);
                if (tag === "0028,0100") bitsAllocated = parseInt(value, 10);
                if (tag === "0002,0010") compressionFormat = value;

                metadata[tag] = value;
            }
        });

        if (width === 0 || height === 0) {
            console.error(`❌ Invalid dimensions for ${file}`);
            return;
        }

        // Check if compressed
        exec(`dcmdump +P 7FE0,0010 ${dicomPath}`, (checkErr, checkStdout) => {
          if (checkErr) {
            console.error(`❌ Failed to check pixel data for ${file}:`, checkErr);
            return;
          }

          const isCompressed = checkStdout.includes("PixelSequence");

          if (isCompressed) {
            console.log(`🟡 ${file} is compressed. Decompressing...`);
            decompressAndExtractPixelData(dicomPath, decompressedDicomPath, file, width, height, bitsAllocated, metadata);
          } else {
            console.log(`✅ ${file} is uncompressed. Extracting pixel data...`);
            extractPixelData(dicomPath, file, width, height, bitsAllocated, metadata);
          }
        });
      });
    });
  });
}

// Decompress and extract pixel data
function decompressAndExtractPixelData(dicomPath, decompressedPath, file, width, height, bitsAllocated, metadata) {
  exec(`gdcmconv --raw ${dicomPath} ${decompressedPath}`, (decompressErr) => {
    if (decompressErr) {
      console.error(`❌ Failed to decompress ${file}:`, decompressErr);
      return;
    }

    console.log(`✅ Decompressed ${file}. Extracting pixel data...`);
    extractPixelData(decompressedPath, file, width, height, bitsAllocated, metadata);
  });
}

// Extract raw pixel data and send via WebSocket
function extractPixelData(dicomPath, file, width, height, bitsAllocated, metadata) {
  const outputRawPath = path.join(__dirname, "public", `${file}.raw`);

  exec(`gdcmraw -i ${dicomPath} -o ${outputRawPath}`, (convertErr) => {
    if (convertErr) {
      console.error(`❌ Failed to extract raw pixel data from ${file}:`, convertErr);
      return;
    }

    fs.readFile(outputRawPath, (err, pixelBuffer) => {
      if (err) {
        console.error(`❌ Failed to read raw pixel file for ${file}:`, err);
        return;
      }

      console.log(`📤 Sending pixel data for ${file} (${width}x${height})`);

      broadcast({
        type: "dicom",
        filename: file,
        metadata,
        width,
        height,
        bitsAllocated,
        pixelData: pixelBuffer.toString("base64")
      });
    });
  });
}

// Send files on startup
setTimeout(sendDicomFiles, 2000);

// WebSocket Connection Handler
wss.on("connection", ws => {
    console.log("🖥️ Client connected");

    ws.on("message", message => {
      let receivedMessage = message.toString().trim();
      console.log("📩 Received:", receivedMessage);
      if (receivedMessage === "request_dicom") {
        console.log('DICOM Requested');
        sendDicomFiles();
      } else {
        console.warn(`⚠️ Unrecognized message: ${receivedMessage}`);
      }
    });
});