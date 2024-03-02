import { GoogleGenerativeAI } from "@google/generative-ai";


async function CheckCompatibleGemini(genAI, prompt) {
  let aiResponse = "Nothing...";
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    aiResponse = await response.text();
  } catch (error) {
    console.error('Error fetching data:', error);
    aiResponse = "ERROR";
  }
  return aiResponse;
}

export default CheckCompatibleGemini;