import { warp_resolver } from '@terra-money/warp-sdk';
import { base64encode } from './base64encode';

export const parseQuery = (value: string): warp_resolver.QueryRequestFor_String => {
  return JSON.parse(value) as warp_resolver.QueryRequestFor_String;
};

export const encodeQuery = (value: string): warp_resolver.QueryRequestFor_String => {
  const input = parseQuery(value);

  if (!('wasm' in input)) {
    return input;
  }

  let msg = input.wasm;

  if ('smart' in msg) {
    msg.smart.msg = base64encode(msg.smart.msg);
  }

  if ('raw' in msg) {
    msg.raw.key = base64encode(msg.raw.key);
  }

  return { wasm: msg };
};
