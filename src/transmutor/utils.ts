import _ from "lodash";

export const getPastKeyValues = (
  decoderOutput: { readonly [x: string]: any },
  outputNames: { [s: string]: unknown } | ArrayLike<unknown>
) =>
  _.reduce(
    _.map(_.values(outputNames), (name: string, index) => [
      `pkv_${index}`,
      decoderOutput[name],
    ]),
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {}
  );
