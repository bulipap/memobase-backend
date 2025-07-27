import express from 'express';
import cors from 'cors';

// 🔁 Your original exports
export * from './src/client';
export * from './src/user';
export * from './src/types';

// 🚀 Express server
const app = express();

// ✅ Enable CORS (optional: adjust allowed origins as needed)
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🧠 Memobase backend is running!');
});

// ✅ Bind to the correct port for Render
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server listening on port ${port}`);
});
