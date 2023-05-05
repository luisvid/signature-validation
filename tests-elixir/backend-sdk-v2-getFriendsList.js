const axios = require("axios");
const fs = require("fs");

// Get friends list for logged in user (jwt) from Elxir-Friends service
// first login with OTP: get transactionId and userCode
// second OTP login verify: get JWT token
// third get Friends List: uses new middleware Verify API Key JWT token

async function main() {
  // read the api key from a file
  const apiKey = fs.readFileSync("../keys/api_key.txt", "utf8");
  let transactionId = "";
  let code = "";
  let token = "";

  //
  //  OTP Login Request
  //
  const data = JSON.stringify({
    email: "rega@satoshis.games",
  });

  let configLogin = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:4002/sdk/auth/v2/signin/otp-login",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
      Cookie:
        "connect.sid=s%3ASu8dqwCPDZSzNSusQN064bBgxnruUEoT.Eexg59UQo%2B8Wk%2B21PmSa%2BobjWSqtBeDsT8ibUu0%2BJrg",
    },
    data: data,
  };

  await axios
    .request(configLogin)
    .then((response) => {
      console.log(
        "\n\nOTP Login Request:\n\n",
        JSON.stringify(response.data, null, 4)
      );
      transactionId = response.data.data.transactionId;
      code = response.data.data.userCode;
    })
    .catch((error) => {
      console.log(error.response.data);
    });

  //
  // OTP Login Verify
  //
  let dataLogin = JSON.stringify({
    transactionId,
    code,
  });

  let configVerify = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:4002/sdk/auth/v2/signin/otp-verify",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
      Cookie:
        "connect.sid=s%3ASu8dqwCPDZSzNSusQN064bBgxnruUEoT.Eexg59UQo%2B8Wk%2B21PmSa%2BobjWSqtBeDsT8ibUu0%2BJrg",
    },
    data: dataLogin,
  };

  await axios
    .request(configVerify)
    .then((response) => {
      console.log(
        "\n\nOTP Login Verify\n\n",
        JSON.stringify(response.data, null, 4)
      );
      token = response.data.data.token;
    })
    .catch((error) => {
      console.log(error.response.data);
    });

  //
  // get friends list
  //
  let configGetFriendsList = {
    method: "get",
    maxBodyLength: Infinity,
    url: 'http://localhost:4101/sdk/v2/friends/',
    headers: {
      "x-api-key": apiKey,
      Authorization: "Bearer " + token,
      Cookie: 'connect.sid=s%3AoLrdUK9hOkM_-a2FesosZ5ALmqM4KWR1.SWNfXu5G9hVAffSKCt794Yco8LNT6X1UphOXFJvQbjA'
    },
  };

  axios
    .request(configGetFriendsList)
    .then((response) => {
      console.log(
        "\n\nget friends list",
        JSON.stringify(response.data, null, 4)
      );
    })
    .catch((error) => {
      console.log(error.response.data);
    });
}

main();
