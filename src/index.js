import express from 'express';
import dotenv from 'dotenv';
import { processRequest } from './service.js';

dotenv.config();

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Main endpoint to process deployment requests
app.post('/generate', async (req, res) => {
  try {
    const { request } = req.body;
    
    if (!request) {
      return res.status(400).json({
        error: 'Missing request parameter',
        example: {
          request: "Deploy a Jupyter notebook with GPU for machine learning"
        }
      });
    }

    const result = await processRequest(request);
    res.json(result);
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// List available templates
app.get('/templates', async (req, res) => {
  try {
    const templates = await loadTemplates();
    const templateList = Object.values(templates).map(t => ({
      id: t.id,
      description: t.description,
      use_cases: t.use_cases,
      tags: t.tags
    }));
    
    res.json({ templates: templateList });
  } catch (error) {
    console.error('Error listing templates:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Example usage:
  curl -X POST http://localhost:${PORT}/generate \\
    -H "Content-Type: application/json" \\
    -d '{"request": "Deploy a Jupyter notebook with RTX 4090 GPU"}'
  `);
});
