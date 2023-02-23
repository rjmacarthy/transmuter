import * as ort from 'onnxruntime-web';

export const sampleLogitsGreedily = (logits: ort.Tensor) => {
  const shape = logits.dims;
  const [batchSize, seqLength, vocabSize] = shape;
  const n = batchSize * seqLength * vocabSize;
  const startIndex = n - vocabSize;
  let argmaxi = 0;
  let argmax = logits.data[startIndex + argmaxi];
  for (let i = 1; i < vocabSize; i++) {
    const logit = logits.data[startIndex + i];
    if (logit > argmax) {
      argmaxi = i;
      argmax = logit;
    }
  }
  return argmaxi;
};