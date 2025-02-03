# THIS IS NOT MEANT TO BE CLEAN CODE, I'm GOIN FASTER THAN USUAL

# dicom-loader
DICOM is a technical standard for the digital storage and transmission of medical images and related information.

  Install DCMTK
sudo apt install dcmtk
  find /usr -name "dcmtk" 2>/dev/null
  find /usr -name "dcmimage.h" 2>/dev/null

  sudo apt update
  sudo apt install dcmtk libdcmtk-dev

  brew install dcmtk

gcc -I/usr/include -L/usr/lib/x86_64-linux-gnu -o dicom_loader dicom_loader.c dicom_loader.cpp -ldcmimage -ldcmdata -ldcmimgle -lstdc++ -lm

got command to work on WSL


attempting NODE
binding.gyp (Node.js Build Configuration)

npm install node-gyp
node-gyp configure build
ls -l build/Release/dicom_loader.node
node -e "console.log(require('./build/Release/dicom_loader'))"
node test.js


## HERE BE DRAGONS

  Install Node.js & Build Tools
sudo apt install nodejs npm build-essential  # Linux
brew install nodejs                           # macOS

Ensure node-gyp is installed:
  npm install -g node-gyp

Install Xcode (for Swift & Objective-C)
  xcode-select --install













## GPT-dump:
an environment to build dicom_loader.c for Node.js (JavaScript), Swift, and C

dicom_loader_project/
│── src/
│   ├── dicom_loader.c   # Your C DICOM loader
│   ├── dicom_loader.h   # Header file for function declarations
│   ├── dicom_loader_node.cpp  # Node.js binding (N-API)
│── binding.gyp          # Node.js build configuration
│── package.json         # NPM package file
│── index.js             # JS wrapper for Node.js
│── test.js              # Sample usage

2. Install Required Dependencies
Before building, you need:

Node.js (latest LTS version)
node-gyp (for compiling C/C++ addons)
Install node-gyp globally
sh
Copy
Edit
npm install -g node-gyp
On macOS/Linux, you might need Xcode Command Line Tools or build-essential:

sh
Copy
Edit
xcode-select --install  # macOS
sudo apt install build-essential  # Linux








Key Restrictions in the DCMTK License
✅ Allowed:
✔ Commercial and non-commercial use
✔ Modification and redistribution (with conditions)
✔ Use in proprietary software (but must include attribution)

🚫 Restrictions:
❌ Attribution Required:

You must include the DCMTK copyright notice in your software.
Any documentation must acknowledge that DCMTK is used.
❌ No Use of "OFFIS" Name:

You cannot use "OFFIS" (the organization behind DCMTK) in advertising or as an endorsement.
❌ No Liability, No Warranty:

DCMTK comes with no warranty.
If it causes damage or issues, you cannot hold OFFIS liable.
❌ Must Distribute the License:

If you redistribute DCMTK (modified or unmodified), you must include the license.