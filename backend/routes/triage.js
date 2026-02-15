const express = require("express");
const router = express.Router();
require("dotenv").config();

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful medical assistant. Give simple advice, diet, exercise, and risk level.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = response.choices[0].message.content;

    res.json({
      success: true,
      reply: reply,
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "AI failed. Check API key.",
    });
  }
});

module.exports = router;

