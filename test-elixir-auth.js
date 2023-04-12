const axios = require("axios");
const fs = require("fs");
const crypto = require("crypto");

// this test call the verifySignature function in the elixir auth
const url = "http://localhost:4002/sdk/auth/v2/signin/verify-signature";

// data to sign
const data = "Hello, world!";
// specify the private key and passphrase
const privateKey = {
  key: fs.readFileSync("./keys/private_key.pem"),
  passphrase: "brocal",
};
// sign the data with the private key
const signature = crypto
  .createSign("SHA256")
  .update(data)
  .sign(privateKey, "base64");

// if no encoding is specified, then the result is returned as a Buffer
const publicKey = fs.readFileSync("./keys/public_key.pem", "utf8");

// data to send to the remote verifySignature function
const postData = {
  data,
  signature,
  publicKey,
};

// test local verifySignature function
const isValid = verifySignature(data, publicKey, signature);
console.log(`Signature is ${isValid ? "valid" : "invalid"}`);

// test remote verifySignature function
axios
  .post(url, postData)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log("error", error.response.data);
  });

// local verifySignature function
function verifySignature(data, publicKey, signature) {
  const verifier = crypto.createVerify("SHA256");
  verifier.update(data);
  verifier.end();
  return verifier.verify(publicKey, signature, "base64");
}
