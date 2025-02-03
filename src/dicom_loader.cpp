#include <dcmtk/dcmimgle/dcmimage.h>
#include "dicom_loader.h"
#include <stdlib.h>
#include <stdio.h>

extern "C" {  // Expose functions to C
    DicomImageData* load_dicom(const char *filename) {
        DicomImage *image = new DicomImage(filename);

        if (!image || image->getStatus() != EIS_Normal) {
            printf("Failed to read DICOM file: %s\n", filename);
            delete image;
            return NULL;
        }

        image->setMinMaxWindow();
        unsigned long frameSize = image->getOutputDataSize();
        unsigned char *buffer = (unsigned char *)malloc(frameSize);

        if (!image->getOutputData(buffer, frameSize, 8)) {
            free(buffer);
            delete image;
            return NULL;
        }

        DicomImageData *dicom = (DicomImageData *)malloc(sizeof(DicomImageData));
        dicom->width = image->getWidth();
        dicom->height = image->getHeight();
        dicom->depth = image->getDepth();
        dicom->pixelData = buffer;

        printf("DICOM loaded successfully: %dx%d Depth:%d\n", dicom->width, dicom->height, dicom->depth);

        delete image;
        return dicom;
    }

    void free_dicom(DicomImageData *image) {
        if (image) {
            free(image->pixelData);
            free(image);
        }
    }
}