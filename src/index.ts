import express from 'express';
import authRoutes from './routes/auth';
import suratRoutes from './routes/surat';
import userRoutes from './routes/user';
import uploadRoutes from './routes/upload';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import { CLI_ARGS } from './services/args';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${CLI_ARGS.env}`, quiet: true });

const app = express();
const PORT = process.env.PORT || 3000;
if (CLI_ARGS.debug) app.use(logger);

app.use('/upload', uploadRoutes)

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/surat', suratRoutes);
app.use('/user', userRoutes);

app.get('/', async (req, res) => {
  res.send("API is Active!!");
});

if (CLI_ARGS.debug) {
  app.use(errorHandler);
  console.log(`[MSG] Running on Debug!!`);
}

console.log(`[MSG] Running on ${CLI_ARGS.env}!`);

app.listen(PORT, () => {
  console.log(`[MSG] Server running on http://localhost:${PORT}`);
});