export const getPastKeyValues = (
  decoderOutput: { readonly [x: string]: any },
  outputNames: { [s: string]: unknown } | ArrayLike<unknown>
) => {
  return Object.values(outputNames)
    .map((name: string, index) => [`pkv_${index}`, decoderOutput[name]])
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
};
