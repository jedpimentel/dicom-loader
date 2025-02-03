#include <node_api.h>
#include "dicom_loader.h"
#include <stdio.h>

napi_value LoadDicomWrapper(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value args[1];
    napi_get_cb_info(env, info, &argc, args, NULL, NULL);

    if (argc < 1) {
        napi_throw_error(env, NULL, "Filename required");
        return NULL;
    }

    char filename[256];
    size_t result;
    napi_get_value_string_utf8(env, args[0], filename, 256, &result);

    DicomImageData *image = load_dicom(filename);
    if (!image) {
        napi_throw_error(env, NULL, "Failed to load DICOM file");
        return NULL;
    }

    napi_value obj;
    napi_create_object(env, &obj);
    napi_value width, height, depth, pixelData;

    napi_create_int32(env, image->width, &width);
    napi_create_int32(env, image->height, &height);
    napi_create_int32(env, image->depth, &depth);
    napi_create_buffer_copy(env, image->width * image->height, image->pixelData, NULL, &pixelData);

    napi_set_named_property(env, obj, "width", width);
    napi_set_named_property(env, obj, "height", height);
    napi_set_named_property(env, obj, "depth", depth);
    napi_set_named_property(env, obj, "pixelData", pixelData);

    free_dicom(image);
    return obj;
}

napi_value Init(napi_env env, napi_value exports) {
    napi_property_descriptor desc = { "loadDicom", 0, LoadDicomWrapper, 0, 0, 0, napi_default, 0 };
    napi_define_properties(env, exports, 1, &desc);
    return exports;
}

NAPI_MODULE(dicom_loader, Init)