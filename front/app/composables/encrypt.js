import CryptoJS from 'crypto-js'

const KEY = CryptoJS.enc.Utf8.parse("Xna4VoFQ7Ayk8szAJwc0qNmwFlw3gAJ=");
const IV = CryptoJS.enc.Utf8.parse("G9cRYFH2gVJv8ono");

function encrypt  (data) {
  return CryptoJS.AES.encrypt(data, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
};

export default encrypt