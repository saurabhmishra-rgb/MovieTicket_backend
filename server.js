import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';
dotenv.config(); 
import databaseConnection from './utils/database.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
// Explicit CORS headers middleware as a fallback to ensure preflight responses
// include the required headers when client sends requests with credentials.
app.use((req, res, next) => {
  const allowedOrigin = "http://localhost:5173";
  console.log('[CORS] incoming request', req.method, 'origin=', req.headers.origin);
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  // For OPTIONS requests, respond immediately
  if (req.method === 'OPTIONS') {
    console.log('[CORS] responding OK to preflight');
    return res.sendStatus(200);
  }
  next();
});
const corsOption = {
  origin: "http://localhost:5173",
  credentials: true
};
// Use CORS with explicit origin and credentials support (required when client uses withCredentials)
app.use(cors(corsOption));
// Note: explicit OPTIONS handler is implemented in the custom middleware above.

//api
app.use("/api/v1/user", userRouter);

app.get('/', (req, res) => {
  res.send(' Movie Ticket Booking Backend is running successfully!');
});

// connect to database then start server
databaseConnection();

app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
