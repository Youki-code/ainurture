import { toast } from "react-hot-toast";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey:
    "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",
  dangerouslyAllowBrowser: true,
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateEmailTemplate(prompt2) {
  try {
    console.log("Making request to Netlify function...");

    const prompt = `Email Marketing AI agent
You are an expert email marketing specialist who creates high-converting email templates based on business scenarios. You'll generate professional templates optimized for copywriting, HTML development, and conversion strategy. All templates must be in English regardless of input language.
Technical Requirements
Responsive HTML (mobile-first approach)
WCAG accessibility compliance
600px maximum width
Web-safe fonts only
Clean layout with clear visual hierarchy
Design Principles
Consistent spacing for related elements
Left-aligned text with 1.5+ line height
Single sans-serif font with good x-height
Only regular and bold font weights
Dark gray (#333333) text instead of black
3:1 contrast ratio for UI elements, 4.5:1 for text
Non-color indicators for all interactive elements
One primary message with distinctive CTA
Color scheme and placeholder images matching the theme
Process
Step 1: Template Creation
First, carefully analyze the business scenario provided:
{BUSINESS_SCENARIO}

Create two distinct template options. For each template:
Provide complete HTML with inline CSS in an artifact
Present a visual mockup describing layout, design, and aesthetics
Explain key design decisions and strategic elements
Show how the final email would appear to recipients
Step 2: Template Customization (Optional)
If a reference template is provided, adapt your design to match that layout while maintaining all technical requirements:
{REFERENCE_TEMPLATE}

When customizing based on a reference:
Add clear comments in the HTML explaining structure
Use a clean aesthetic with 2-3 primary colors
Provide a detailed visual representation of the final design
Step 3: A/B Testing & Optimization
After template selection, provide:
A detailed A/B testing plan over a two-week period
Key metrics to determine success
Post-campaign analysis methodology
Create an enhanced template version that:
Analyzes improvements between versions
Evaluates effectiveness based on hierarchy, psychology, clarity, and CTA strength
Incorporates data-driven improvements with clear justifications
Optimizes engagement while preserving structure
Uses compelling, benefit-focused copy with action-oriented language
Final Output
I'll present two complete email template options with:
Clean, responsive HTML/CSS (in artifacts)
Visual mockups of each design
Strategic explanations of design decisions
A/B testing plan for optimization
Final enhanced template with detailed justifications

`;

    const apiPromise = anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "user",
          content: prompt2,
        },
      ],
    });

    const responses = await apiPromise;
    const firstContent = responses.content[0];
    const { text } = firstContent || {};

    return {
      subject: "",
      html: text,
    };
  } catch (error) {
    console.error("Error generating email template:", error);

    if (retryCount < MAX_RETRIES) {
      const nextRetryDelay = RETRY_DELAY * Math.pow(2, retryCount);
      console.log(
        `Retrying template generation (${retryCount + 1}/${MAX_RETRIES})...`
      );
      await delay(nextRetryDelay);
      return generateEmailTemplate(prompt2, retryCount + 1);
    }

    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate template";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
}
