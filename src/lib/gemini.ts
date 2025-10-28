import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export async function getRecipeResponse(userQuery: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a professional chef assistant. Only answer food-related queries.
For the given query: "${userQuery}"

If this is NOT a food-related query, respond with exactly: "NOT_FOOD_QUERY"

If it IS a food-related query, provide the response in this structured format:

🍽️ Ingredients:
[List them clearly with quantities]

🔥 Cooking Procedure:
[Step-by-step guide with numbered steps]

⚖️ Calories:
[Mention approximate calories per serving]

💡 Cooking Tips:
[Provide helpful preparation or serving tips]
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get recipe. Please check your API key and try again.");
  }
}
