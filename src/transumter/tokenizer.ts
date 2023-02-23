import { getTransmuter } from "../module";
import { TOKENIZER_URL } from "../var/constants";

export const getTokenizer = async () => {
  const transmuter = await getTransmuter();
  const response = await fetch(TOKENIZER_URL);
  const data = await response.json();
  return new transmuter.Transumter(JSON.stringify(data));
};
