import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
nacl.util = naclUtil;

export default function encryptWithRandomKey(messageUtf8) {
  const key = nacl.randomBytes(nacl.secretbox.keyLength);
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const message = nacl.util.decodeUTF8(messageUtf8);
  const box = nacl.secretbox(message, nonce, key);

  const fullMessage = new Uint8Array(nonce.length + box.length);
  fullMessage.set(nonce);
  fullMessage.set(box, nonce.length);

  // Generate random file id
  // input.replace(/[^0-9a-z]/gi, "");

  return {
    message: nacl.util.encodeBase64(fullMessage),
    key
  };
}
