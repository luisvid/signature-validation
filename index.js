const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// endpoint to validate a signature
app.post('/validate', (req, res) => {
  const { data, publicKey, signature } = req.body;

  // Verify the signature
  const verifier = crypto.createVerify("SHA256");
  verifier.update(data);
  verifier.end();
  const isValid =  verifier.verify(publicKey, signature, "base64");

  res.json({ isValid });
});

// It's important to export the http.Server object returned by app.listen(3000) 
// instead of just the function app, otherwise you will get 
// TypeError: app.address is not a function from the tests
module.exports = app.listen(port);
