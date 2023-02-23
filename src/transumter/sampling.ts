import * as ort from "onnxruntime-web";
import _ from "lodash";

export const greedy = (logits: ort.Tensor) => {
  const data = logits.data as Float32Array;
  const [batchSize, seqLength, vocabSize] = logits.dims;
  const n = batchSize * seqLength * vocabSize;
  const startIndex = n - vocabSize;
  return _.reduce(
    _.range(1, vocabSize),
    (prev, curr) =>
      data[startIndex + curr] > data[startIndex + prev] ? curr : prev,
    0
  );
};
