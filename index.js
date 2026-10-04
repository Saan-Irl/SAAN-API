const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/apis.json", (req, res) => {
  res.sendFile(path.join(__dirname, "apis.json"));
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    name: "SAAN API",
    message: "SAAN API is online!"
  });
});

app.get("/api/ping", (req, res) => {
  res.json({
    success: true,
    message: "Pong! SAAN API is working."
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SAAN API running on port ${PORT}`);
});
