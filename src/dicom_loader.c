#include <stdio.h>
#include "dicom_loader.h"

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Usage: %s <DICOM_FILE>\n", argv[0]);
        return 1;
    }

    DicomImageData *image = load_dicom(argv[1]);

    if (image) {
        printf("DICOM Image Loaded: %d x %d, Depth: %d\n", image->width, image->height, image->depth);
        free_dicom(image);
    } else {
        printf("Failed to load DICOM image.\n");
    }

    return 0;
}
// #include <stdio.h>
// #include <stdlib.h>

// typedef struct {
//     int width;
//     int height;
//     int depth;
//     unsigned char *pixelData;
// } DicomImageData;

// #ifdef __cplusplus
// extern "C" {
// #endif
//     DicomImageData* load_dicom(const char *filename);
//     void free_dicom(DicomImageData *image);
// #ifdef __cplusplus
// }
// #endif

// DicomImageData* load_dicom(const char *filename) {
//     return load_dicom_cpp(filename); // Calls C++ function from the wrapper
// }

// void free_dicom(DicomImageData *image) {
//     if (image) {
//         free(image->pixelData);
//         free(image);
//     }
// }