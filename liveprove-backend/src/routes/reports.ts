import express from 'express';

import { analyzeIncident } from '../services/ai';

const router = express.Router();

router.post('/api/analyze', async (req, res) => {
  const { title, tag, location_name } = req.body ?? {};
  const safeTitle = String(title ?? '');
  const safeTag = String(tag ?? '');
  const safeLocationName = String(location_name ?? '');

  if (!safeTitle || !safeTag || !safeLocationName) {
    return res.status(400).json({ error: 'Missing required fields: title, tag, location_name' });
  }

  try {
    const result = await analyzeIncident(safeTitle, safeTag, safeLocationName);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: 'AI analysis failed', details: err?.message ?? String(err) });
  }
});

export const reportsRouter = router;

