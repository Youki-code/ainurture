import toast from 'react-hot-toast';

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
    console.log('666 - Making request to API endpoint');
    
    const response = await fetch('/api/anthropic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audience,
        scenario,
        type,
        goal,
        referenceTemplate,
      }),
    });

    console.log('666 - API Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('666 - API Error:', errorData);
      throw new Error(errorData.error || `API Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('666 - API Response data:', data);
    
    // Validate response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format');
    }

    if (!data.subject || !data.html) {
      throw new Error('Invalid template structure: missing required fields');
    }
    
    return {
      subject: data.subject,
      html: data.html
    };
  } catch (error) {
    console.error('666 - Error generating email template:', error);

    if (retryCount < MAX_RETRIES) {
      const nextRetryDelay = RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`666 - Retrying template generation (${retryCount + 1}/${MAX_RETRIES})...`);
      await delay(nextRetryDelay);
      return generateEmailTemplate(audience, scenario, type, goal, referenceTemplate, retryCount + 1);
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to generate template';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
}