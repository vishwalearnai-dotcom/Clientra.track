import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { organizationRouter } from './routes/organizationRoutes.js';
import { departmentRouter } from './routes/departmentRoutes.js';
import { memberRouter } from './routes/memberRoutes.js';
import { taskRouter } from './routes/taskRoutes.js';
import { alertRouter } from './routes/alertRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Clientra Track SaaS Backend API', timestamp: new Date().toISOString() });
});

// SaaS API v1 Routes
app.use('/api/v1/organizations', organizationRouter);
app.use('/api/v1/departments', departmentRouter);
app.use('/api/v1/members', memberRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/alerts', alertRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 [Clientra Track API] Server running on http://localhost:${PORT}`);
});

export default app;
