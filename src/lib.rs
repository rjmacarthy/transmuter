use std::str::FromStr;

use wasm_bindgen::prelude::*;
use tokenizers::tokenizer::{Tokenizer, Encoding};
use js_sys;

#[wasm_bindgen]
pub struct Transumtor {
    tokenizer: Tokenizer,
    _encoding: Encoding,
}

#[wasm_bindgen]
pub struct WEncoding {
    encoding: Encoding
}

#[wasm_bindgen]
impl Transumtor {
    #[wasm_bindgen(constructor)]
    pub fn from_pretrained (json: String) -> Transumtor {
        Transumtor {
            _encoding: Encoding::default(),
            tokenizer: Tokenizer::from_str(json.as_str()).unwrap(),
        }
    }
    pub fn encode(&self, text: &str, add_special_tokens: bool) -> WEncoding {
        WEncoding { encoding: self.tokenizer.encode(text, add_special_tokens).unwrap() }
    }
    pub fn decode(&self, ids: Vec<i64>, skip_special_tokens: bool) -> js_sys::JsString {
        let ids = ids.iter().map(|i| *i as u32).collect::<Vec<u32>>();
        let decoded = self.tokenizer.decode(ids, skip_special_tokens).unwrap();
        js_sys::JsString::from(decoded)
    }
}

#[wasm_bindgen]
impl WEncoding {
    #[wasm_bindgen(getter = inputIds)]
    pub fn get_ids(&self) -> Result<js_sys::BigInt64Array, JsValue> {
        let mut vec = Vec::new();
        for i in self.encoding.get_ids().iter() {
            vec.push(*i as i64);
        }
        let mask = js_sys::BigInt64Array::from(vec.as_slice());
        Ok(mask)
    }

    #[wasm_bindgen(getter = attentionMask)]
    pub fn get_attention_mask(&self) -> Result<js_sys::BigInt64Array, JsValue> {
        let mut vec = Vec::new();
        for i in self.encoding.get_attention_mask().iter() {
            vec.push(*i as i64);
        }
        let mask = js_sys::BigInt64Array::from(vec.as_slice());
        Ok(mask)
    }
}
