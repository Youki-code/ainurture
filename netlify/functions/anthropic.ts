import { Handler } from '@netlify/functions';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client outside handler for reuse
const anthropic = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY
});

const systemPrompt = `You are an expert email marketing copywriter and HTML developer. Your task is to create compelling, conversion-focused email templates that follow modern email design best practices.

Guidelines:
- Use responsive HTML email design
- Follow accessibility best practices
- Keep the design clean and focused
- Include clear calls-to-action
- Optimize for mobile devices
- Use web-safe fonts
- Keep the width under 600px

Format the response as a JSON object with:
{
  "subject": "Email subject line",
  "html": "Complete HTML template"
}`;

export const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    if (!process.env.VITE_ANTHROPIC_API_KEY) {
      throw new Error('Missing Anthropic API key');
    }

    let requestData;
    try {
      requestData = JSON.parse(event.body || '{}');
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }

    const { audience, scenario, type, goal, referenceTemplate } = requestData;

    // Validate required fields
    if (!audience || !scenario || !type || !goal) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const prompt = `Create an email template with the following parameters:

Target Audience: ${audience}
Scenario: ${scenario}
Email Type: ${type}
Goal: ${goal}
${referenceTemplate ? `Reference Template Style: ${referenceTemplate}` : ''}

Generate a complete, production-ready HTML email template that's optimized for deliverability and conversions. Return the response in valid JSON format with 'subject' and 'html' fields.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 4000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    if (!response.content || response.content.length === 0) {
      throw new Error('Empty response from Claude API');
    }

    let template;
    try {
      // Extract JSON from the response
      const jsonMatch = response.content[0].text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      template = JSON.parse(jsonMatch[0]);
      
      // Validate template structure
      if (!template.subject || !template.html) {
        throw new Error('Invalid template structure');
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
      // Attempt to create a structured response from unstructured text
      template = {
        subject: 'Email Campaign',
        html: response.content[0].text
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(template)
    };
  } catch (error) {
    console.error('Error generating template:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error'
      })
    };
  }
};