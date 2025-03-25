# Spheron Protocol YAML Generator

LLM-powered YAML configuration generator for Spheron Protocol deployments.

## Features

- Natural language to YAML conversion
- Smart template matching with LLM
- Parameter extraction from user requests
- Fallback to Jupyter notebook template
- Default configurations for quick deployment

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
- Copy `.env.example` to `.env`
- Add your OpenAI API key to `.env`

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Available Templates

### 1. Jupyter Notebook (CUDA)
- Template: `jupyter-cuda.json`
- Use Case: Data science and machine learning workloads
- Features:
  - NVIDIA CUDA support
  - RTX 4090 GPU acceleration
  - Pre-installed data science packages
  - Jupyter Lab interface

### 2. Stable Diffusion WebUI
- Template: `stable-diffusion-webui.json`
- Use Case: AI image generation
- Features:
  - Automatic1111 WebUI
  - GPU acceleration
  - Model management
  - Custom extension support

### 3. Blender GPU
- Template: `blender-gpu.json`
- Use Case: 3D rendering and animation
- Features:
  - GPU-accelerated rendering
  - CUDA/OptiX support
  - Remote rendering capabilities

### 4. Hunyuan 3D
- Template: `hunyuan-3d.json`
- Use Case: 3D model generation
- Features:
  - AI-powered 3D modeling
  - GPU acceleration
  - Custom model training

### 5. WAN Video Generation
- Template: `wan-video-gen.json`
- Use Case: AI video generation
- Features:
  - Video synthesis
  - Frame interpolation
  - GPU acceleration

## API Endpoints

### Generate YAML
```bash
POST /generate
Content-Type: application/json

{
  "request": "Deploy a Jupyter notebook with RTX 4090 GPU"
}
```

Response:
```json
{
  "yaml": "...",
  "templateUsed": "jupyter-cuda",
  "parameters": {
    "duration": "1h",
    "gpu_model": "rtx4090",
    "price_amount": 1,
    ...
  },
  "reasoning": "..."
}
```

### List Templates
```bash
GET /templates
```

Response:
```json
{
  "templates": [
    {
      "id": "jupyter-cuda",
      "description": "...",
      "use_cases": [...],
      "tags": [...]
    },
    ...
  ]
}
```

## Default Configuration

When no specific template matches or for fallback cases:

- Duration: 1 hour
- GPU: RTX 4090
- Price: 1 CST/hour
- Region: westcoast

## Resource Requirements

Different templates have different resource requirements:

| Template | Min RAM | GPU | Storage |
|----------|---------|-----|---------|
| Jupyter CUDA | 16GB | RTX 4090 | 20GB |
| Stable Diffusion | 16GB | RTX 4090 | 30GB |
| Blender GPU | 32GB | RTX 4090 | 50GB |
| Hunyuan 3D | 32GB | RTX 4090 | 40GB |
| WAN Video Gen | 32GB | RTX 4090 | 50GB |

## Example Requests

1. Basic Jupyter notebook:
```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"request": "Deploy a Jupyter notebook with GPU"}'
```

2. Specific requirements:
```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{"request": "Deploy Stable Diffusion with 64GB RAM in Europe region"}'
```

## Deployment Regions

Available deployment regions:
- westcoast (Default)
- eastcoast
- europe
- asia

## Error Handling

The service provides detailed error messages for common issues:
- Invalid template parameters
- Resource constraints
- Region availability
- GPU availability

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
