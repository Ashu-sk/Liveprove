export async function analyzeReport(videoUri: string, title: string, tag: string): Promise<any> {
  const response = await fetch('http://localhost:3001/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      tag,
      location_name: 'New Delhi, India',
    }),
  });

  const json = await response.json();
  if (!response.ok) {
    const message = typeof json?.error === 'string' ? json.error : 'AI request failed';
    throw new Error(message);
  }
  return json;
}

