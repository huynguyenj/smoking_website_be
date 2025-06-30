import { env } from '@/config/environment'
import axios from 'axios'
const generateRecommendPlan = async (content) => {
  try {
    const contentText= `You are a Lung Specialist. Return only clean HTML advice with no explanations. Based on the condition: ${content}, give personalized advice and way to get out of it and wrapped in clean HTML.`
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