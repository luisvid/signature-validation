const request = require("supertest");
const fs = require("fs");
const crypto = require("crypto");
const app = require("./index.js");

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

afterEach(async () => {
  // Close the server instance after each test
  await app.close();
});

describe("Signature validation", () => {
  it("should return true for a valid signature", async () => {
    const response = await request(app)
      .post("/validate")
      .send({ data, publicKey, signature });

    expect(response.body.isValid).toBe(true);
  });

  it("should return false for an invalid signature", async () => {
    const response = await request(app)
      .post("/validate")
      .send({ data, publicKey, signature: "invalid_signature" });

    expect(response.body.isValid).toBe(false);
  });
});
