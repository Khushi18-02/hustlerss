const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getAIResponse(data) {
  try {
    const prompt = `
    You are a medical assistant AI.

    Patient Details:
    Age: ${data.age}
    Gender: ${data.gender}
    Symptoms: ${data.symptoms}

    Give:
    1. Risk level (LOW, MEDIUM, HIGH)
    2. Short explanation
    3. Diet plan
    4. Exercise advice
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful medical assistant." },
        { role: "user", content: prompt }
      ],
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error("AI ERROR:", error.message);
    return "AI failed. Please check API key or server.";
  }
}

module.exports = { getAIResponse };
