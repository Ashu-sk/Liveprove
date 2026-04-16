import OpenAI from 'openai';

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('Missing OPENAI_API_KEY');
  return new OpenAI({ apiKey });
}

const SYSTEM_PROMPT =
  'You are a public safety AI for LiveProve. Analyze incident reports and return ONLY valid JSON with no markdown, no backticks, just raw JSON.';

export type AnalyzeIncidentResult = {
  incident_type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  authority_needed: 'Police' | 'Fire Department' | 'Ambulance' | 'Traffic Police' | 'Municipal Corp';
  ai_summary: string;
  safe_to_publish: boolean;
};

function extractJsonObject(text: string): string {
  const trimmed = (text ?? '').trim();
  const first = trimmed.indexOf('{');
  const last = trimmed.lastIndexOf('}');
  if (first === -1 || last === -1 || last <= first) return trimmed;
  return trimmed.slice(first, last + 1);
}

export async function analyzeIncident(
  title: string,
  tag: string,
  location_name: string,
): Promise<AnalyzeIncidentResult> {
  const prompt =
    `Incident reported: Title: ${title}. Category: ${tag}. Location: ${location_name}. ` +
    'Analyze this and return JSON with exactly these fields:\n' +
    'incident_type, severity (critical/high/medium/low), confidence (0-1),\n' +
    'authority_needed (Police/Fire Department/Ambulance/Traffic Police/Municipal Corp),\n' +
    'ai_summary (one factual sentence under 15 words), safe_to_publish (true/false)';

  const client = getClient();
  const response = await client.responses.create({
    model: 'gpt-4o',
    input: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
  });

  const text = response.output_text ?? '';
  const jsonText = extractJsonObject(text);
  return JSON.parse(jsonText) as AnalyzeIncidentResult;
}

