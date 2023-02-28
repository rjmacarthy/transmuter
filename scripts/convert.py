from fastT5 import export_and_get_onnx_model

model_name = 'google/flan-t5-base'
model = export_and_get_onnx_model(model_name, custom_output_path="./static", quantized=False)
