import express from 'express';
import cors from 'cors';

// 🔁 Your original exports
export * from './src/client';
export * from './src/user';
export * from './src/types';

// 🚀 Express server
const app = express();

// ✅ Enable CORS for your frontend (with credentials support)
app.use(cors({
  origin: "https://emanuel-memory.onrender.com", // frontend URL
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🧠 Memobase backend is running!');
});

// ✅ Bind to the correct port for Render (no fallback!)
const port = process.env.PORT;
if (!port) throw new Error('❌ Missing PORT environment variable');

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`✅ Server listening on port ${port}`);
});
