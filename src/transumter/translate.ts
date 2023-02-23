import * as ort from "onnxruntime-web";

import { forward } from "./forward";
import { getTokenizer } from "./tokenizer";
import { OUTPUT_MAX_LEN } from "../var/constants";
import { sampleLogitsGreedily } from "./sampling";

export const translate = async (input: string) => {
  const tokenizer = await getTokenizer();
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
      hiddenStates: any;
      pkvs: any;
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

  return decoded;
};
