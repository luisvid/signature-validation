const axios = require("axios");
const fs = require("fs");
const crypto = require("crypto");

// Creates a new depot and adds it to an existing build
// POST /createDepot

// first call the verifySignature function in the elixir auth to  get JWT token
// endpoint POST /signature-verify
// second  POST /createDepot: uses new middleware Verify API Key JWT token

async function main() {
  // read the api key from a file
  const apiKey = fs.readFileSync("../keys/api_key.txt", "utf8");
  let token = "";
  const newDepot = {
    "input": {
      "build_id": "d13d3fb1-080a-47bd-90bf-0586cd391686",
      "file": {
        "keyS3": "game/0d3a01eb/builds/.../8bd39c7270_lightnite_0_3_8_7_elixir_mac_zip",
        "url": "https://elixir-gaming.s3.eu-west-2.amazonaws.com/game/.../SignedHeaders=host",
        "name": "lightnite_0.3.8.7_elixir_mac.zip",
        "size": 606695288,
        "type": "application/zip",
        "patchFromVersion": "0.4.5.7",
        "signatureFile": "https://signatureFile",
        "patchFile": "https://patachFile"
      },
      "os": "WIN",
      "architecture": "V64",
      "title": "Mac Lightnite 0.3.8.7 20210730-TEST",
      "installPath": "Applications/Lightnite",
      "launchCmd": "Applications/Lightnite/Lightnite.app/Contents/MacOS/LightniteElixir",
      "userId": "aea1f008-c8a6-4041-bd2d-95a7c4735d36"
    }
  }

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
  // post createDepot
  //
  let configcreateDepot = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:4101/sdk/v2/createDepot",
    headers: {
      "x-api-key": apiKey,
      Authorization: "Bearer " + token,
      Cookie:
        "connect.sid=s%3AqfKz0c2scG_hGn_LazbWf6PZkRVnXrLE.x6uCQB4LJLRHSLllQnAzlelOPHLBKxzZipBj0OfAsD8",
    },
    data: newDepot,
  };

  axios
    .request(configcreateDepot)
    .then((response) => {
      console.log(
        "\n\n*** -> CreateDepot SDK V2 \n\n",
        JSON.stringify(response.data, null, 4)
      );
    })
    .catch((error) => {
      console.log(error.response.data);
    });
}

main();
