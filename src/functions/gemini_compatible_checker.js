async function CheckCompatibleGemini(genAI, prompt) {
  let aiResponse = "Nothing...";
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    aiResponse = await response.text();

    setTimeout(() => {}, 3000);
  } catch (error) {
    console.error('Error fetching data:', error);
    aiResponse = "ERROR";
  }
  return aiResponse;
}

export default CheckCompatibleGemini;