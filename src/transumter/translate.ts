import * as ort from "onnxruntime-web";

import { forward } from "./forward";
import { TransmuterTokenizer } from "./tokenizer";
import { OUTPUT_MAX_LEN } from "../var/constants";
import { greedy } from "./sampling";

const transmuter = new TransmuterTokenizer();

export const translate = async (input: string) => {
  if (!transmuter.ready) {
    await transmuter.init();
  }

  const tokenizer = transmuter.tokenizer;
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

    const outputId = greedy(logits);

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
