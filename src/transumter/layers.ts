import * as ort from "onnxruntime-web";
import { MODEL_NAME } from "../var/constants";

export class Layers {
  encoder: any;
  decoder: any;
  initDecoder: any;
  ready: boolean = false;

  public getLayers() {
    if (!this.ready) {
      throw new Error("Session not initialized");
    }

    return {
      encoder: this.encoder,
      decoder: this.decoder,
      initDecoder: this.initDecoder,
    };
  }

  public async init() {
    ort.env.wasm.wasmPaths = {
      "ort-wasm.wasm": "ort-wasm.wasm",
      "ort-wasm-threaded.wasm": "ort-wasm-threaded.wasm",
      "ort-wasm-simd.wasm": "ort-wasm-simd.wasm",
      "ort-wasm-simd-threaded.wasm": "ort-wasm-simd-threaded.wasm",
    };

    const encoder = await (
      await fetch(`${MODEL_NAME}-encoder.onnx`, { cache: "force-cache" })
    ).arrayBuffer();

    const decoder = await (
      await fetch(`${MODEL_NAME}-decoder.onnx`, { cache: "force-cache" })
    ).arrayBuffer();

    const initDecoder = await (
      await fetch(`${MODEL_NAME}-init-decoder.onnx`, {
        cache: "force-cache",
      })
    ).arrayBuffer();

    this.encoder = await ort.InferenceSession.create(encoder, {
      executionProviders: ["wasm"],
    });

    this.initDecoder = await ort.InferenceSession.create(initDecoder, {
      executionProviders: ["wasm"],
    });

    this.decoder = await ort.InferenceSession.create(decoder, {
      executionProviders: ["wasm"],
    });

    this.ready = true;
  }
}
