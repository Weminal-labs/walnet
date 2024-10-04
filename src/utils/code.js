import { Buffer } from "buffer";

function toB64(bytes) {
  return Buffer.from(bytes).toString("base64");
}

function fromB64(base64String) {
  return new Uint8Array(Buffer.from(base64String, "base64"));
}

export const CodeUtils = {
  toB64,
  fromB64,
};
