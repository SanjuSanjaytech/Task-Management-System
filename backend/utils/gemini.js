import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.Gemini_API_KEY);

export const extractTaskfromText = async (userText) => {
    const model = genAi.getGenerativeModel({model: "gemini-1.5-flash" })

    const prompt =`
        You are a task extraction assistant.

    Extract task info from the text and return ONLY valid JSON.

    Fields:
    - title (string)
    - description (string)
    - dueDate (YYYY-MM-DD or null)
    - priority (Low, Medium, High)

    Text: "${userText}"

    Return JSON only, no explanation.
    `
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    
    return JSON.parse(response)
};

