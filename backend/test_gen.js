const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testGen() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    try {
        const result = await model.generateContent("Explain IT support in one sentence.");
        console.log("Success:", await result.response.text());
    } catch (e) {
        console.error("Error:", e.message);
    }
}

testGen();
