import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';
import databaseConnection from './utils/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Custom CORS handler (for safety)
app.use((req, res, next) => {
  const allowedOrigin = "http://localhost:5173";
  console.log('[CORS]', req.method, req.headers.origin);
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Use cors
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Routes
app.use("/api/v1/user", userRouter);

// Test route
app.get('/', (req, res) => {
  res.send(' Movie Ticket Booking Backend is running successfully!');
});

// Connect database and start server
databaseConnection();

app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
