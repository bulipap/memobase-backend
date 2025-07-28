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

// ✅ Bind to the correct port for Render with proper TypeScript typing
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, '0.0.0.0', async () => {
  console.log(`✅ Server listening on port ${port}`);

  // ✅ Start Memobase server instance with injected config
  const { createMemoBaseServer } = await import('./src/server');
  await createMemoBaseServer({
    config: {
      apiKey: process.env.MEMOBASE_API_KEY ?? 'emanuel-secret-key',
    },
  });
});
