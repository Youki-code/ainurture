import { toast } from "react-hot-toast";

export async function checkAnthropicApiKey() {
  try {
    // Make a test request to our Netlify function
    const response = await fetch("/api/anthropic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audience: "test",
        scenario: "test",
        type: "test",
        goal: "test",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      toast.error(`API Error: ${errorData.error || response.statusText}`);
      return false;
    }

    try {
      const data = await response.json();
      if (!data || !data.subject || !data.html) {
        toast.error("Invalid API response format");
        return false;
      }
      return true;
    } catch (parseError) {
      console.error("Error parsing API response:", parseError);
      toast.error("Invalid response format from API");
      return false;
    }
  } catch (error) {
    console.error("Error validating API key:", error);
    toast.error("Failed to validate API key. Please try again.");
    return false;
  }
}
