import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { reportsRouter } from './routes/reports';

const app = express();

app.use(cors());
app.use(express.json());

app.use(reportsRouter);

const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
  console.log(`liveprove-backend listening on http://localhost:${port}`);
});

