{
  "targets": [
    {
      "target_name": "dicom_loader",
      "sources": [ 
        "src/dicom_loader.c",
        "src/dicom_loader.cpp",
        "src/dicom_loader_node.c" ],
      "libraries": [ "-ldcmimage", "-ldcmdata", "-ldcmimgle" ],
      "include_dirs": [
        "<!(node -e \"console.log(require('node-addon-api').include)\")"
      ],
      "cflags": [ "-std=c11" ],
      "cxxflags": [ "-std=c++17" ]
    }
  ]
}