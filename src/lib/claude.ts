import toast from 'react-hot-toast';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true
});

interface EmailTemplate {
  subject: string;
  html: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function generateEmailTemplate(
  audience: string,
  scenario: string,
  type: string,
  goal: string,
  referenceTemplate?: string,
  retryCount = 0
): Promise<EmailTemplate> {
  try {
    console.log('Making request to Netlify function...');

    const prompt = `Step 1:Create an email template that follows essential UX design principles to reduce cognitive load and improve readability:
STRUCTURE:
Group related information with adequate white space
Establish a clear visual hierarchy with primary, secondary, and tertiary elements
Left-align text for natural reading flow
TYPOGRAPHY:
Use a single sans-serif font with good x-height (taller lowercase letters)
Implement a 1.5+ line height for body text
Limit uppercase text to short headings only
Stick to regular and bold weights only
Use dark gray (#333333) instead of pure black for text
VISUAL ELEMENTS:
Apply a consistent design pattern throughout
Ensure all interface elements meet 3:1 contrast ratio
Ensure all text meets 4.5:1 contrast ratio
Include non-color indicators alongside any color-based information
Use color strategically and sparingly to guide attention
CONTENT APPROACH:
Focus on a single primary message/action
Minimize unnecessary information
Present information in digestible chunks
Make the primary call-to-action clearly distinguishable
Please create a clean, accessible email template that applies these principles while keeping cognitive load to a minimum.

Step 2: Create an HTML email template based on the UX design principles I shared previously. The template should:
STRUCTURE & LAYOUT:
Follow a layout similar to the image I've uploaded
Include clear sections for header, main content, and footer
Use responsive design principles that work across devices
CODE REQUIREMENTS:
Provide complete, production-ready HTML code
Include inline CSS (for email compatibility)
Ensure the template works in major email clients
Add helpful comments explaining key sections
DESIGN ELEMENTS:
Incorporate a clean, minimalist aesthetic
Use limited color palette (2-3 colors maximum)
Include placeholders for logo, images, and content
Make sure all text and UI elements meet accessibility contrast requirements
Please create the complete HTML email template code and show a visual representation of how the final design will look. Include explanations for any design decisions you made based on the UX principles.
Step 3: Optimize the student engagement email template for Tripalink to better activate and re-engage student leads. Please:
MAINTAIN STRUCTURE:
Keep the current email layout exactly as shown
Preserve all existing sections and their arrangement
COLOR OPTIMIZATION:
Revise the color scheme following the design principles I shared earlier
Ensure 4.5:1 contrast ratio for all text elements
Use color strategically to highlight key actions and information
Implement a cohesive palette that appeals to student audiences
COPY IMPROVEMENTS:
Rewrite headlines and body text to be more compelling for students
Focus on clear benefits and specific value propositions
Use concise, action-oriented language
Include effective calls-to-action that motivate response
Maintain a conversational, student-friendly tone
DESIGN RULE APPLICATION:
Apply all previously mentioned design rules (spacing, typography, hierarchy, etc.)
Ensure the design reduces cognitive load
Make sure all similar elements function consistently
Use sans-serif fonts with appropriate line height
Please provide both the optimized design elements and explain the specific improvements made to colors and copy that will help Tripalink better engage student leads.
Step 4: Compare the original and revised email templates for Tripalink's student engagement campaign, then create an even more optimized version.
COMPARATIVE ANALYSIS:
Analyze specific improvements in the revised template compared to the original
Identify how the changes address the design principles I mentioned earlier
Evaluate the effectiveness for student engagement based on:
Visual hierarchy and information flow
Color psychology and emotional impact
Copywriting clarity and persuasiveness
Call-to-action effectiveness
FURTHER OPTIMIZATIONS:
Propose additional improvements beyond the current revision
Address any remaining issues or missed opportunities
Consider student-specific behavioral psychology principles
Suggest A/B testing options if applicable
FINAL TEMPLATE:
Create an enhanced version incorporating all insights
Explain the rationale behind each new improvement
Highlight how these changes will better activate student leads for Tripalink
Please provide both the analysis and the improved template design with specific explanations of why this version will be more effective at re-engaging student leads.
Note: Only HTML needs to be returned, no explanation is required`;

  const prompt2 = `You are an expert email marketing copywriter and HTML developer. Your task is to create compelling, conversion-focused email templates that follow modern email design best practices.

Guidelines:
- Use responsive HTML email design
- Follow accessibility best practices
- Keep the design clean and focused
- Include clear calls-to-action
- Optimize for mobile devices
- Use web-safe fonts
audience:${audience}
scenario:${scenario}
type:${type}
goal:${goal}
- Keep the width under 600px Note: Only HTML needs to be returned, no explanation is required`

   const apiPromise = anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt
        },
        {
          role: "user",
          content: prompt2
        }
      ]
    });

     const responses = await apiPromise;
      const firstContent:any = responses.content[0];
      const { text } = firstContent || {};

     return {
      subject: '',
      html: text
    }
    
  //   const response = await fetch('/api/anthropic', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       audience,
  //       scenario,
  //       type,
  //       goal,
  //       referenceTemplate,
  //     }),
  //   });

  //   if (!response.ok) {
  //     const errorData = await response.json().catch(() => ({}));
  //     throw new Error(errorData.error || `API Error: ${response.statusText}`);
  //   }

    // const data = await response.json();
    
    // // Validate response structure
    // if (!data || typeof data !== 'object') {
    //   throw new Error('Invalid response format');
    // }

    // if (!data.subject || !data.html) {
    //   throw new Error('Invalid template structure: missing required fields');
    // }
    
    // return {
    //   subject: data.subject,
    //   html: data.html
    // };
  } catch (error) {
    console.error('Error generating email template:', error);

    if (retryCount < MAX_RETRIES) {
      const nextRetryDelay = RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`Retrying template generation (${retryCount + 1}/${MAX_RETRIES})...`);
      await delay(nextRetryDelay);
      return generateEmailTemplate(audience, scenario, type, goal, referenceTemplate, retryCount + 1);
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to generate template';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
}