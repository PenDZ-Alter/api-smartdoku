import express from 'express';
import authRoutes from './routes/auth';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

app.use('/auth', authRoutes);

app.get('/', async (req, res) => {
  res.send("Hello, this is API for Pensudis!!");
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});