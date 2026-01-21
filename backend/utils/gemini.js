// utils/gemini.js
const axios = require("axios");

/**
 * Converts DD-MM-YYYY string to JS Date
 * Returns null if input is null or invalid
 */
function parseDateString(dateStr) {
  if (!dateStr) return null;

  const [day, month, year] = dateStr.split("-");
  if (!day || !month || !year) return null;

  const jsDate = new Date(`${year}-${month}-${day}`);
  if (isNaN(jsDate.getTime())) return null;

  return jsDate;
}

async function extractTaskfromText(userText) {
  try {
    const prompt = `
      You are a smart task extraction assistant.

      Today's date is: ${new Date().toISOString().split("T")[0]}

      Extract task info from the user's text and return ONLY valid JSON.

      Rules:
      - dueDate MUST be in DD-MM-YYYY format
      - If user says "today", use today's date
      - If user says "tomorrow", use tomorrow's date
      - If user says "next week", choose 7 days from today
      - If no date is mentioned, return null
      - priority must be only one of: Low, Medium, High
      - Do not include markdown
      - Do not include explanation
      - Return raw JSON only

      Fields:
      - title (string)
      - description (string)
      - dueDate (DD-MM-YYYY or null)
      - priority (Low, Medium, High)

      User text: "${userText}"

      Return only JSON.
    `;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const aiText = response.data.candidates[0].content.parts[0].text;
    console.log("Gemini response:", aiText);

    // Clean up JSON if it has any markdown
    const cleanedText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsed = JSON.parse(cleanedText);

    // Convert dueDate to JS Date
    parsed.dueDate = parseDateString(parsed.dueDate);

    // Fallbacks
    if (!parsed.title) parsed.title = "Untitled Task";
    if (!parsed.description) parsed.description = "No description provided";
    if (!parsed.priority) parsed.priority = "Medium";

    return parsed;

  } catch (err) {
    console.log("Gemini error:", err.response?.data || err.message);
    throw new Error("AI Task creation failed");
  }
}

module.exports = { extractTaskfromText };
