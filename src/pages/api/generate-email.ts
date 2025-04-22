import { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { audience, scenario, type, goal, template } = req.body;

    if (!audience || !scenario || !type || !goal) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `Generate an email template for:
- Audience: ${audience}
- Scenario: ${scenario}
- Type: ${type}
- Goal: ${goal}
${template ? `\nUse this template as a reference:\n${template}` : ''}

Please provide the email in HTML format with a subject line. Format the response as JSON with 'subject' and 'html' fields.`;

    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const content = response.content[0].text;
    const result = JSON.parse(content);

    return res.status(200).json({
      subject: result.subject,
      html: result.html
    });
  } catch (error) {
    console.error('Error generating email template:', error);
    return res.status(500).json({ error: 'Failed to generate email template' });
  }
} 