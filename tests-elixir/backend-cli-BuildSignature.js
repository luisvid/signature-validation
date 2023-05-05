const axios = require("axios");
const fs = require("fs");
const crypto = require("crypto");

// returns latest build signature for CLI
// GET /buildSignature/{gameId}/{publicKey}/{privateKey}/{os}

// first call the verifySignature function in the elixir auth to  get JWT token
// endpoint POST /signature-verify
// second get gamebuild URL: uses new middleware Verify API Key JWT token

async function main() {
  // read the api key from a file
  const apiKey = fs.readFileSync("../keys/api_key.txt", "utf8");
  let token = "";

  //
  // auth /signature-verify
  //

  // data to sign
  const data = "Hello, world!";
  // specify the private key and passphrase
  const privateKey = {
    key: fs.readFileSync("../keys/private_key.pem"),
    passphrase: "brocal",
  };
  // sign the data with the private key
  const signature = crypto
    .createSign("SHA256")
    .update(data)
    .sign(privateKey, "base64");
  // if no encoding is specified, then the result is returned as a Buffer
  const publicKey = fs.readFileSync("../keys/public_key.pem", "utf8");

  // data to send to the remote verifySignature function
  const dataVerify = {
    data,
    signature,
    publicKey,
  };

  let configVerify = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:4002/sdk/auth/v2/signin/signature-verify",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
      Cookie:
        "connect.sid=s%3ASu8dqwCPDZSzNSusQN064bBgxnruUEoT.Eexg59UQo%2B8Wk%2B21PmSa%2BobjWSqtBeDsT8ibUu0%2BJrg",
    },
    data: dataVerify,
  };

  await axios
    .request(configVerify)
    .then((response) => {
      console.log(
        "\n\n*** -> AUTH signature-verify token \n\n",
        JSON.stringify(response.data, null, 4)
      );
      token = response.data.data.token;
    })
    .catch((error) => {
      console.log(error.response.data);
    });

  //
  // get buildSignature
  //
  let configGamebuildURL = {
    method: "get",
    maxBodyLength: Infinity,
    url: "http://localhost:4101/sdk/v2/buildSignature/0d3a01eb-73dd-4f7b-a81f-91aa0e7420c6/WIN",
    headers: {
      "x-api-key": apiKey,
      Authorization: "Bearer " + token,
      Cookie:
        "connect.sid=s%3AqfKz0c2scG_hGn_LazbWf6PZkRVnXrLE.x6uCQB4LJLRHSLllQnAzlelOPHLBKxzZipBj0OfAsD8",
    },
  };

  axios
    .request(configGamebuildURL)
    .then((response) => {
      console.log(
        "\n\n*** -> get gamebuild URL SDK V2 \n\n",
        JSON.stringify(response.data, null, 4)
      );
    })
    .catch((error) => {
      console.log(error.response.data);
    });
}

main();
