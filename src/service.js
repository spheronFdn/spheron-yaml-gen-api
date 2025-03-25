import { OpenAI } from "openai";
import fs from "fs/promises";
import path from "path";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultQuery: { use_cache: true },
  defaultHeaders: {
    "HTTP-Referer": "https://github.com/spheronFdn/spheron-yaml-gen-api",
    "X-Title": "Spheron YAML Generator",
  },
});

// Load all templates from the templates directory
async function loadTemplates() {
  const templatesDir = path.join(process.cwd(), "templates");
  const files = await fs.readdir(templatesDir);
  const templates = {};

  for (const file of files) {
    if (file.endsWith(".json")) {
      const content = await fs.readFile(path.join(templatesDir, file), "utf8");
      const template = JSON.parse(content);
      templates[template.id] = template;
    }
  }

  return templates;
}

// Match user request to best template using LLM
async function findBestTemplate(userRequest, templates) {
  const prompt = `
You are a template matching system for Spheron Protocol deployments.
Given a user's deployment request, find the most appropriate template from the available options.

Available templates:
${Object.values(templates)
  .map(
    (t) => `
- ${t.id}:
  Description: ${t.description}
  Use cases: ${t.use_cases.join(", ")}
  Tags: ${t.tags.join(", ")}
`
  )
  .join("\n")}

User request: "${userRequest}"

Return a JSON response with:
{
  "templateId": "selected-template-id",
  "confidence": 0.0-1.0,
  "reasoning": "Brief explanation of why this template was selected"
}

If no template matches well (confidence < 0.8), return null for templateId.
`;

  const response = await client.chat.completions.create({
    model: "google/gemini-2.0-flash-001",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
}

// Extract parameters from user request
async function extractParameters(userRequest, template) {
  const prompt = `
Given a user's deployment request and a template's parameters, extract appropriate parameter values.

Template: ${template.id}
Parameters:
${Object.entries(template.parameters)
  .map(
    ([key, param]) => `
${key}:
  Type: ${param.type}
  Default: ${param.default}
  Description: ${param.description}
  ${param.options ? `Options: ${param.options.join(", ")}` : ""}
  ${param.min !== undefined ? `Min: ${param.min}` : ""}
  ${param.max !== undefined ? `Max: ${param.max}` : ""}
`
  )
  .join("\n")}

User request: "${userRequest}"

Return a JSON object with extracted parameter values. Use template defaults if a parameter isn't specified in the request.
`;

  const response = await client.chat.completions.create({
    model: "google/gemini-2.0-flash-001",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
}

// Generate YAML from template and parameters
function generateYaml(template, parameters) {
  let yaml = template.base_yaml;

  // Replace all parameter placeholders
  for (const [key, value] of Object.entries(parameters)) {
    const placeholder = `{{${key}}}`;
    yaml = yaml.replace(new RegExp(placeholder, "g"), value);
  }

  return yaml;
}

// Main function to process user request
export async function processRequest(userRequest) {
  try {
    const templates = await loadTemplates();
    const match = await findBestTemplate(userRequest, templates);

    let selectedTemplate;
    let parameters;
    let reasoning;

    if (match.templateId && match.confidence >= 0.8) {
      selectedTemplate = templates[match.templateId];
      parameters = await extractParameters(userRequest, selectedTemplate);
      reasoning = match.reasoning;
    } else {
      // Fallback to Jupyter template with default values
      selectedTemplate = templates["jupyter-cuda"];
      parameters = {
        duration: "1h",
        gpu_model: "rtx4090",
        price_amount: 1,
        cpu_units: 4,
        memory_size: "16Gi",
        storage_size: "120Gi",
        region: "westcoast",
        jupyter_token: "secure_token",
      };
      reasoning =
        "No high-confidence template match found. Using Jupyter notebook template with default values.";
    }

    const yaml = generateYaml(selectedTemplate, parameters);

    return {
      yaml,
      templateUsed: selectedTemplate.id,
      parameters,
      reasoning,
    };
  } catch (error) {
    console.error("Error processing request:", error);
    throw error;
  }
}
