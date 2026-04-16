import express from 'express';

import { analyzeIncident } from '../services/ai';

const router = express.Router();

router.post('/api/analyze', async (req, res) => {
  const title = String(req.body?.title ?? '');
  const tag = String(req.body?.tag ?? '');
  const location_name = String(req.body?.location_name ?? '');

  if (!title || !tag || !location_name) {
    return res.status(400).json({ error: 'Missing required fields: title, tag, location_name' });
  }

  try {
    const result = await analyzeIncident(title, tag, location_name);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: 'AI analysis failed', details: err?.message ?? String(err) });
  }
});

export const reportsRouter = router;

