import { processRequest } from '../src/service.js';

// Test cases
const testRequests = [
  "Deploy a Jupyter notebook with RTX 4090 GPU for machine learning",
  "I need Stable Diffusion with 64GB RAM in Europe region",
  "Set up Blender for 3D rendering with GPU",
  "Deploy a basic development environment",
  "I want to run HunyuanAI for 3D generation"
];

async function runTests() {
  console.log('Running test requests...\n');
  
  for (const request of testRequests) {
    console.log(`Request: "${request}"`);
    console.log('-------------------');
    
    try {
      const result = await processRequest(request);
      console.log('Template Used:', result.templateUsed);
      console.log('Reasoning:', result.reasoning);
      console.log('Parameters:', JSON.stringify(result.parameters, null, 2));
      console.log('YAML Preview (first 300 chars):', result.yaml.substring(0, 300) + '...\n');
    } catch (error) {
      console.error('Error processing request:', error);
    }
    
    console.log('===================\n');
  }
}

// Run tests
runTests().catch(console.error);
