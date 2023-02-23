import * as ort from "onnxruntime-web";

import { OUTPUT_MAX_LEN, TOKENIZER_URL } from "../transmutor/constants";
import { forward } from "../transmutor/forward";
import { sampleLogitsGreedily } from "../transmutor/sampling";

export const translate = (input: string) => {
  import("../../pkg/index").then((module) => {
    fetch(TOKENIZER_URL)
      .then((response) => response.json())
      .then(async (data) => {
        const tokenizer = new module.Transumtor(JSON.stringify(data));
        const encoding = tokenizer.encode(input, true);

        let outputIds = [0n];
        let encoderOutputs = null;
        let pastKeyValues = null;

        for (let i = 0; i < OUTPUT_MAX_LEN; i++) {
          const {
            logits,
            hiddenStates,
            pkvs,
          }: {
            logits: ort.Tensor;
            hiddenStates: ort.Tensor;
            pkvs: { [x: string]: any };
          } = await forward(
            encoding.inputIds,
            outputIds,
            encoderOutputs,
            pastKeyValues
          );

          encoderOutputs = hiddenStates;
          pastKeyValues = pkvs;

          const outputId = sampleLogitsGreedily(logits);

          outputIds.push(outputId as unknown as bigint);

          if (outputId === 1) {
            break;
          }
        }

        const outputTensorData = new ort.Tensor(
          "int64",
          new BigInt64Array(outputIds.map((x) => BigInt(x))),
          [1, outputIds.length]
        ).data;

        const decoded = tokenizer.decode(outputTensorData, true);

        console.log(`Output: ${decoded}`);
        return decoded;
      });
  });
};