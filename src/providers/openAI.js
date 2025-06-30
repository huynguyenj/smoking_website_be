import { env } from '@/config/environment'
import axios from 'axios'
const generateRecommendPlan = async (content) => {
  try {
    const contentText = `
        You are a Lung Health Specialist.

        Return only a clean HTML response with no extra explanations or markdown formatting.

        Always follow this structure:

        <h2>Personalized Lung Health Advice</h2>

        <h3>Based on your profile:</h3>
        <ul>
          <li>[Condition detail 1]</li>
          <li>[Condition detail 2]</li>
          <li>[Condition detail 3]</li>
        </ul>

        <h3>Recommendations:</h3>
        <ol>
          <li><b>[Tip 1 Title]:</b> [Tip 1 description]</li>
          <li><b>[Tip 2 Title]:</b> [Tip 2 description]</li>
          ...
        </ol>

        Now, based on the condition: "${content}", fill in this HTML template with personalized and medically appropriate advice.
        Do not include <html>, <head>, <body> or any markdown syntax like \`\`\`. Return only the inner HTML content.
        `
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.OPEN_AI_KEY}`, {
      contents: [
        {
          parts: [{ text: contentText }]
        }
      ]
    },
    {
      header: {
        'Content-Type': 'application/json'
      }
    }
    )
    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response'
  } catch (error) {
    throw new Error(error)
  }
}

export const chatGPT = {
  generateRecommendPlan
}
//You are a Lung Specialist. Return only clean HTML advice with no explanations. Based on the condition: ${content}, give personalized advice and way to get out of it and wrapped in clean HTML.
// You are a Lung Specialist. Based on the condition: ${content}, give personalized advice wrapped in clean HTML elements. Do not explain or mention your role. Return only HTML with no intro or explanation.