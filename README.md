
## Node.js and Express project exposing an endpoint to validate a signature

This app exposes the POST endpoint `/validate` that receives `data`, `public-Key`, and `signature` in the request body.


- It uses the `crypto` module to verify the signature. 
- It creates a `Verify` object with the `SHA256` algorithm, update it with the `data`, and verify it with the `publicKey` and `signature`.
- To test this, there is a test file called `test.js`
- In the test file, It usea the `supertest` library to make HTTP requests to the app. It reads the `private_key.pem` file to generate a signature for the `data`, and also read the `public_key.pem` file to send it in the request body.

    To run the tests, run the following command in your terminal:
    ```
    npm test
    ```

### Keys

The `keys` folder contains the private and public keys used to sign the data file

To sign data with a public key in macOS, you can use the OpenSSL command-line tool. Here are the steps:

1. Open the Terminal app on your Mac.

2. Generate a private key using the following command:

   ```
   openssl genpkey -algorithm RSA -out private_key.pem -aes256
   ```

   This will generate a private key in the `private_key.pem` file.

3. Extract the public key from the private key using the following command:

   ```
   openssl rsa -in private_key.pem -out public_key.pem -pubout
   ```

   This will extract the public key from the private key and save it in the `public_key.pem` file.

4. Sign the data using the private key and the `openssl dgst` command. For example, to sign a file named `data.txt`, use the following command:

   ```
   openssl dgst -sha256 -sign private_key.pem -out signature.bin data.txt
   ```

   This will generate a signature file named `signature.bin`.

5. Verify the signature using the public key and the `openssl dgst` command. For example, to verify the signature on the `data.txt` file, use the following command:

   ```
   openssl dgst -sha256 -verify public_key.pem -signature signature.bin data.txt
   ```

   If the signature is valid, you should see a message indicating that the signature is OK.

That's it! You have successfully signed data with a public key in macOS using OpenSSL.
