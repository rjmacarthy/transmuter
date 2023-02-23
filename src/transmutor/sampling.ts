import * as ort from "onnxruntime-web";
import _ from "lodash";

export const sampleLogitsGreedily = (logits: ort.Tensor) => {
  const shape = logits.dims;
  const [batchSize, seqLength, vocabSize] = shape;
  const n = batchSize * seqLength * vocabSize;
  const startIndex = n - vocabSize;
  const argmaxi = _.reduce(
    _.range(1, vocabSize),
    (prevArgmaxi, i) => {
      const logit = logits.data[startIndex + i];
      const prevLogit = logits.data[startIndex + prevArgmaxi];
      return logit > prevLogit ? i : prevArgmaxi;
    },
    0
  );
  return argmaxi;
};
