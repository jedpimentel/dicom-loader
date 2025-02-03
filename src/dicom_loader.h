#ifndef DICOM_LOADER_H
#define DICOM_LOADER_H

#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
    int width;
    int height;
    int depth;
    unsigned char *pixelData;
} DicomImageData;

DicomImageData* load_dicom(const char *filename);
void free_dicom(DicomImageData *image);

#ifdef __cplusplus
}
#endif

#endif // DICOM_LOADER_H



// #ifdef __cplusplus
// extern "C" {
//     DicomImageData* load_dicom_cpp(const char *filename);
// }
// #endif

// #endif // DICOM_LOADER_H