const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;
let model = null;

function initLLM(apiKey) {
    if (!apiKey) {
        console.warn("LLM: No API Key provided.");
        return;
    }
    genAI = new GoogleGenerativeAI(apiKey);
    // Using gemini-2.0-flash as discovered from API list
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("LLM: Gemini initialized (gemini-2.0-flash).");
}

async function generateText(prompt) {
    if (!model) {
        console.warn("LLM: Model not initialized. Returning mock response.");
        return "LLM not configured. Please set API Key.";
    }

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("LLM Error:", error);
        return "Error generating response.";
    }
}

module.exports = { initLLM, generateText };
