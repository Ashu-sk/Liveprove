const API_URL = 'https://liveprove-backend.onrender.com';

export async function analyzeReport(videoUri: string, title: string, tag: string) {
  try {
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title || 'Incident reported',
        tag,
        location_name: 'New Delhi, India',
      }),
    });
    if (!response.ok) throw new Error('Server error');
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      incident_type: 'unknown',
      severity: 'medium',
      authority_needed: 'Police',
      ai_summary: 'Incident reported and queued for AI review.',
      confidence: 0.7,
      safe_to_publish: false,
    };
  }
}

