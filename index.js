const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// SAAN API CONFIG
// ===============================
app.get("/apis.json", (req, res) => {
  res.sendFile(path.join(__dirname, "apis.json"));
});

// ===============================
// HOME
// ===============================
app.get("/", (req, res) => {
  res.json({
    success: true,
    name: "SAAN API",
    message: "SAAN API is online!"
  });
});

// ===============================
// PING
// ===============================
app.get("/api/ping", (req, res) => {
  res.json({
    success: true,
    message: "Pong! SAAN API is working."
  });
});

// ===============================
// TRANSLATE
// ===============================
app.get("/api/translate", async (req, res) => {
  try {
    const { text, to = "bn" } = req.query;

    if (!text) {
      return res.status(400).json({
        status: false,
        message: "Text is required."
      });
    }

    const targetLang = String(to).trim();

    const url =
      `https://translate.googleapis.com/translate_a/single` +
      `?client=gtx` +
      `&sl=auto` +
      `&tl=${encodeURIComponent(targetLang)}` +
      `&dt=t` +
      `&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Translation service returned ${response.status}`);
    }

    const data = await response.json();

    let translated = "";

    if (Array.isArray(data?.[0])) {
      translated = data[0]
        .map(item => item?.[0] || "")
        .join("");
    }

    if (!translated) {
      throw new Error("Translation result is empty.");
    }

    const fromLang = data?.[2] || "auto";

    return res.json({
      status: true,
      translated,
      from_lang: fromLang,
      to_lang: targetLang
    });

  } catch (error) {
    console.error("Translate error:", error.message);

    return res.status(500).json({
      status: false,
      message: "Translation failed."
    });
  }
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`SAAN API running on port ${PORT}`);
});
