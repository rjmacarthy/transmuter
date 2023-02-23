import * as ort from 'onnxruntime-web';

import { Layers } from "./layers";
import { getPastKeyValues } from "./utils";

const layers = new Layers();

export const forward = async (
  inputTokenIds: string | any[] | readonly number[] | BigInt64Array,
  decoderInputIds: bigint[],
  encoderOutputs: any,
  pastKeyValues: { [x: string]: any; }
) => {
  const inputIdLength = inputTokenIds.length;

  if (!layers.ready) {
    await layers.init();
  }

  const { encoder, decoder, initDecoder } = layers.getLayers();

  const inputTensor = new ort.Tensor("int64", inputTokenIds as readonly number[], [
    1,
    inputIdLength,
  ]);

  const attentionMaskTensor = new ort.Tensor(
    "int64",
    new BigInt64Array(inputIdLength).fill(1n),
    [1, inputIdLength]
  );

  const encoderOutput = await encoder.run({
    input_ids: inputTensor,
    attention_mask: attentionMaskTensor,
  });

  const hiddenStates = encoderOutputs
    ? encoderOutputs
    : encoderOutput.hidden_states;

  const decoderFeeds: any = {
    input_ids: new ort.Tensor(
      "int64",
      new BigInt64Array(decoderInputIds.map((x) => BigInt(x))),
      [1, decoderInputIds.length]
    ),
    encoder_attention_mask: attentionMaskTensor,
    encoder_hidden_states: hiddenStates,
  };

  if (!pastKeyValues) {
    const initDecoderOutput = await initDecoder.run(decoderFeeds);

    return {
      logits: initDecoderOutput.logits,
      hiddenStates: encoderOutput.hidden_states,
      pkvs: getPastKeyValues(initDecoderOutput, initDecoder.outputNames.slice(1)),
    };
  }

  for (const pkv of Object.keys(pastKeyValues)) {
    decoderFeeds[pkv] = pastKeyValues[pkv as keyof typeof pastKeyValues];
  }

  const decoderOutput = await decoder.run(decoderFeeds);

  pastKeyValues = getPastKeyValues(decoderOutput, decoder.outputNames.slice(1));

  return {
    logits: decoderOutput.logits,
    hiddenStates: encoderOutput.hidden_states,
    pkvs: pastKeyValues,
  };
};