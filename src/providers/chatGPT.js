import { env } from '@/config/environment'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: env.OPEN_AI_KEY,
  defaultHeaders: {
    'HTTP-Referer': env.BUILD_MODE === 'production' ? env.SERVER_URL_PROD : 'http://localhost:8000',
    'X-Title': 'Smoking web'
  }
})

const generateRecommendPlan = async (content) => {
  try {

    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-exp:free',
      messages: [
        {
          role: 'system',
          content: 'You are a Lung Specialist. Return only clean HTML advice with no explanations.'
        },
        {
          role: 'user',
          content: `Based on the condition: ${content}, give personalized advice and way to get out of it and wrapped in clean HTML.`
        }
      ],
      temperature: 1,
      max_tokens: 3000
    })
    return response.choices[0].message.content
  } catch (error) {
    throw new Error(error)
  }
}

export const chatGPT = {
  generateRecommendPlan
}

// You are a Lung Specialist. Based on the condition: ${content}, give personalized advice wrapped in clean HTML elements. Do not explain or mention your role. Return only HTML with no intro or explanation.