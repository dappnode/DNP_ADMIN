import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
nacl.util = naclUtil;

const nonceLength = nacl.secretbox.nonceLength;

export default function decrypt(data, key) {
  try {
    const keyUint8Array = nacl.util.decodeBase64(key);
    const messageWithNonceAsUint8Array = nacl.util.decodeBase64(data);
    const nonce = messageWithNonceAsUint8Array.slice(0, nonceLength);
    const message = messageWithNonceAsUint8Array.slice(
      nonceLength,
      data.length
    );
    const decrypted = nacl.secretbox.open(message, nonce, keyUint8Array);
    if (!decrypted) {
      throw new Error("Could not decrypt message");
    }
    return nacl.util.encodeUTF8(decrypted);
  } catch (e) {
    e.message = `Error decoding encrypted data: ${e.message}`;
    throw e;
  }
}
