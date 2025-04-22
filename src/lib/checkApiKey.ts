import toast from 'react-hot-toast';

export async function checkAnthropicApiKey(): Promise<boolean> {
  try {
    console.log('666 - Checking API key');
    
    const response = await fetch('/api/anthropic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audience: 'test',
        scenario: 'test',
        type: 'test',
        goal: 'test'
      })
    });

    console.log('666 - API key check response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('666 - API key check error:', errorData);
      toast.error(`API Error: ${errorData.error || response.statusText}`);
      return false;
    }

    try {
      const data = await response.json();
      console.log('666 - API key check response data:', data);
      
      if (!data || !data.subject || !data.html) {
        console.log('666 - Invalid API response format');
        toast.error('Invalid API response format');
        return false;
      }
      return true;
    } catch (parseError) {
      console.error('666 - Error parsing API response:', parseError);
      toast.error('Invalid response format from API');
      return false;
    }
  } catch (error) {
    console.error('666 - Error validating API key:', error);
    toast.error('Failed to validate API key. Please try again.');
    return false;
  }
}