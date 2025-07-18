import express from 'express';
import authRoutes from './routes/auth';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import { CLI_ARGS } from './services/args';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${CLI_ARGS.env}`, quiet: true });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
if (CLI_ARGS.debug) app.use(logger);

app.use('/auth', authRoutes);

app.get('/', async (req, res) => {
  res.send("Hello, this is API for Pensudis!!");
});

if (CLI_ARGS.debug) {
  app.use(errorHandler);
  console.log(`[MSG] Running on Debug!!`);
}

console.log(`[MSG] Running on ${CLI_ARGS.env}!`);

app.listen(PORT, () => {
  console.log(`[MSG] Server running on http://localhost:${PORT}`);
});