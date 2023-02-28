import { Transumter } from "../../pkg";
import { getTransmuter } from "../module";
import { TOKENIZER_URL } from "../var/constants";

export class TransmuterTokenizer {
  tokenizer: Transumter | null = null;
  ready: boolean = false;

  public async getTokenizer() {
    if (!this.tokenizer) {
      const transmuter = await getTransmuter();
      const response = await fetch(TOKENIZER_URL);
      const data = await response.json();
      this.ready = true;
      this.tokenizer = new transmuter.Transumter(JSON.stringify(data));
    }

    return this.tokenizer;
  }

  public async init() {
    return this.getTokenizer();
  }

}