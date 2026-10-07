import CryptoJS from "crypto-js";

const KEY = CryptoJS.enc.Utf8.parse("Xna4VoFQ7Ayk8szAJwc0qNmwFlw3gAJ=");
const IV = CryptoJS.enc.Utf8.parse("G9cRYFH2gVJv8ono");

function decrypt(data) {
  const bytes = CryptoJS.AES.decrypt(data, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return bytes.toString(CryptoJS.enc.Utf8);
}

export default decrypt;