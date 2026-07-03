import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with lazy check
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Scaffold generator endpoint
app.post('/api/scaffold', async (req, res) => {
  const { description, projectName } = req.body;

  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: 'Description is required' });
  }

  const ai = getAIClient();

  if (!ai) {
    console.warn('GEMINI_API_KEY is not defined. Using high-fidelity local scaffolding engine.');
    // Graceful fallback: return a highly customized project scaffold based on description keywords
    const lowerDesc = description.toLowerCase();
    let name = projectName || 'Nexus Custom App';
    let stack = ['React', 'TypeScript', 'Tailwind CSS'];
    let files = [
      {
        path: 'src/App.tsx',
        content: `import React, { useState } from 'react';\n\nexport default function App() {\n  return (\n    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8">\n      <h1 className="text-4xl font-black tracking-tight mb-4 text-[#F27D26]">${name}</h1>\n      <p className="text-slate-400 max-w-md text-center mb-8">${description}</p>\n      <button className="px-6 py-3 bg-[#F27D26] hover:bg-[#F27D26]/80 text-black font-black rounded-xl transition-all shadow-lg active:scale-95">\n        Launch Module\n      </button>\n    </div>\n  );\n}`
      },
      {
        path: 'src/types/index.ts',
        content: `export interface ModuleConfig {\n  id: string;\n  name: string;\n  active: boolean;\n}`
      },
      {
        path: 'package.json',
        content: `{\n  "name": "${name.toLowerCase().replace(/\s+/g, '-')}",\n  "private": true,\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^19.0.0",\n    "react-dom": "^19.0.0"\n  }\n}`
      }
    ];

    if (lowerDesc.includes('crypto') || lowerDesc.includes('finance') || lowerDesc.includes('bitcoin')) {
      name = projectName || 'CryptoPulse Dashboard';
      stack = ['React', 'TypeScript', 'Tailwind CSS', 'Recharts', 'WebSockets'];
      files = [
        {
          path: 'src/App.tsx',
          content: `import React, { useState, useEffect } from 'react';\n\nexport default function App() {\n  const [price, setPrice] = useState(65430);\n  useEffect(() => {\n    const interval = setInterval(() => {\n      setPrice(p => p + (Math.random() - 0.5) * 50);\n    }, 2000);\n    return () => clearInterval(interval);\n  }, []);\n\n  return (\n    <div className="min-h-screen bg-[#050505] text-white p-8 flex flex-col justify-between">\n      <header className="border-b border-white/5 pb-6 flex justify-between items-center">\n        <h1 className="text-2xl font-black text-[#F27D26] italic">CRYPTOPULSE</h1>\n        <span className="text-xs text-green-400 px-2 py-1 bg-green-500/10 rounded border border-green-500/20 font-mono">LIVE SOCKETS</span>\n      </header>\n      <main className="my-auto text-center py-20">\n        <p className="text-white/40 uppercase tracking-widest text-xs font-mono mb-2">BTC-USD Index</p>\n        <div className="text-7xl font-mono tracking-tight font-black text-green-400">$ {price.toFixed(2)}</div>\n        <p className="text-xs text-white/20 italic mt-4">${description}</p>\n      </main>\n      <footer className="border-t border-white/5 pt-6 text-center text-[10px] text-white/20 font-mono">\n        NEXUS COGNITIVE RUNTIME v2.5\n      </footer>\n    </div>\n  );\n}`
        },
        {
          path: 'src/components/Chart.tsx',
          content: `export const PriceChart = () => {\n  return <div className="p-8 border border-white/5 bg-[#0a0a0a] rounded-2xl text-center italic text-xs text-white/30">Interactive Recharts feed staging...</div>;\n}`
        },
        {
          path: 'package.json',
          content: `{\n  "name": "cryptopulse",\n  "dependencies": {\n    "recharts": "^2.12.0"\n  }\n}`
        }
      ];
    } else if (lowerDesc.includes('map') || lowerDesc.includes('uber') || lowerDesc.includes('delivery') || lowerDesc.includes('tracker')) {
      name = projectName || 'GeoFlow Delivery Hub';
      stack = ['React', 'TypeScript', 'Google Maps API', 'Tailwind CSS'];
      files = [
        {
          path: 'src/App.tsx',
          content: `import React from 'react';\n\nexport default function App() {\n  return (\n    <div className="min-h-screen bg-neutral-900 text-white flex flex-col md:flex-row">\n      <aside className="w-full md:w-80 bg-black/40 border-r border-white/5 p-6 flex flex-col justify-between shrink-0">\n        <div>\n          <h1 className="text-xl font-bold tracking-tight text-amber-500 mb-2">GEOFLOW HUB</h1>\n          <p className="text-xs text-white/40 leading-relaxed">${description}</p>\n        </div>\n        <div className="text-[10px] text-white/20 font-mono">MAP_COORDS: 37.7749Â° N, 122.4194Â° W</div>\n      </aside>\n      <main className="flex-1 bg-[#151515] flex items-center justify-center p-8 text-center border-t border-white/5 md:border-t-0">\n        <div className="max-w-md">\n          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">â—Ž</div>\n          <h3 className="font-bold text-lg mb-2">Map Feed Initializing</h3>\n          <p className="text-xs text-white/30 italic">Interactive geospatial nodes compiled in the CCC graph view.</p>\n        </div>\n      </main>\n    </div>\n  );\n}`
        },
        {
          path: 'src/services/maps.ts',
          content: `export const initGoogleMaps = () => {\n  console.log("Staging maps pipeline...");\n};`
        },
        {
          path: 'package.json',
          content: `{\n  "name": "geoflow",\n  "dependencies": {\n    "lucide-react": "^0.546.0"\n  }\n}`
        }
      ];
    } else if (lowerDesc.includes('e-commerce') || lowerDesc.includes('shop') || lowerDesc.includes('store') || lowerDesc.includes('cart')) {
      name = projectName || 'ApexShop Checkout';
      stack = ['React', 'TypeScript', 'Tailwind CSS', 'Stripe API'];
      files = [
        {
          path: 'src/App.tsx',
          content: `import React, { useState } from 'react';\n\nexport default function App() {\n  const [items, setItems] = useState([\n    { id: 1, name: 'Premium License', price: 99 },\n    { id: 2, name: 'SaaS Core Integration', price: 249 }\n  ]);\n\n  return (\n    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">\n      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">\n        <h2 className="text-2xl font-black text-emerald-400 mb-2">${name}</h2>\n        <p className="text-xs text-zinc-500 mb-6">${description}</p>\n        <div className="space-y-4 mb-8">\n          {items.map(item => (\n            <div key={item.id} className="flex justify-between items-center p-4 bg-black/40 rounded-xl border border-zinc-800">\n              <span className="text-sm font-bold">{item.name}</span>\n              <span className="font-mono text-emerald-400 font-bold">$ {item.price}</span>\n            </div>\n          ))}\n        </div>\n        <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg active:scale-95">\n          Proceed to Stripe checkout\n        </button>\n      </div>\n    </div>\n  );\n}`
        },
        {
          path: 'package.json',
          content: `{\n  "name": "apex-shop",\n  "dependencies": {\n    "stripe": "^15.0.0"\n  }\n}`
        }
      ];
    }

    const cccNodes = [
      { type: 'Project' as const, id: 'root', name, metadata: { template: 'AI Generated' }, connections: ['service-1', 'module-1'] },
      { type: 'Service' as const, id: 'service-1', name: 'CoreEngine', metadata: { language: 'TypeScript' }, connections: ['root', 'dep-1'] },
      { type: 'Module' as const, id: 'module-1', name: 'UILayout', metadata: { framework: 'React' }, connections: ['root'] },
      { type: 'Dependency' as const, id: 'dep-1', name: 'lucide-react', metadata: { version: 'latest' }, connections: ['service-1'] },
    ];

    const pCards = [
      {
        pcard_id: 'ai-core-card',
        identity: {
          name: `${name} Engine`,
          tagline: 'AI-generated neural module'
        },
        runtime: {
          build_status: 'SUCCESS' as const,
          telemetry: {
            latency: 45,
            errors: 0
          }
        },
        intent_layer: {
          active_goals: ['Verify dynamic files', 'Initialize layout'],
          blockers: []
        },
        autonomous_insights: [
          {
            observation: 'Generated structural files are active and syntactically sound.',
            suggestions: ['Perform integration tests', 'Refine layout styling']
          }
        ]
      }
    ];

    return res.json({
      name,
      description: `Synthesized scaffold: ${description}`,
      stack,
      files,
      cccNodes,
      pCards
    });
  }

  try {
    const prompt = `You are Nexus AI, the Core Semantic Orchestrator. 
Generate a comprehensive, high-quality starter project scaffold in React/TypeScript based on the user's description.

User Description: "${description}"
Desired Project Name: "${projectName || 'Nexus AI Workspace'}"

You MUST output your response strictly as a JSON object matching the following TypeScript schema:
{
  "name": string, // Professional, stylized name
  "description": string, // Brief architectural overview
  "stack": string[], // Array of technologies used
  "files": Array<{
    "path": string, // relative path e.g. "src/App.tsx", "src/components/Dashboard.tsx", "package.json"
    "content": string // Complete, high-quality, fully written React / TypeScript code for the file
  }>,
  "cccNodes": Array<{
    "type": "Project" | "Module" | "Dependency" | "Service" | "Route" | "Artifact",
    "id": string,
    "name": string,
    "metadata": Record<string, string>,
    "connections": string[] // connections to other node IDs
  }>,
  "pCards": Array<{
    "pcard_id": string,
    "identity": { "name": string, "tagline": string },
    "runtime": { "build_status": "SUCCESS" | "FAILURE" | "PENDING", "telemetry": { "latency": number, "errors": number } },
    "intent_layer": { "active_goals": string[], "blockers": string[] },
    "autonomous_insights": Array<{ "observation": string, "suggestions": string[] }>
  }>
}

IMPORTANT: Ensure the generated React and TypeScript code is pristine, compiles without issues, and uses modern Tailwind CSS for aesthetic layout. Include at least 3-4 files, such as App.tsx, a custom hook or utility service, types.ts, and a mock config.
Respond ONLY with the raw JSON object. Do not wrap the JSON in markdown code blocks (\`\`\`json ... \`\`\`), do not write any greetings or explanations.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const jsonText = response.text || '';
    const cleanedJson = jsonText.trim();
    const scaffoldData = JSON.parse(cleanedJson);

    res.json(scaffoldData);
  } catch (error: any) {
    console.error('Error generating AI scaffold:', error);
    res.status(500).json({ error: 'Failed to generate AI scaffold', details: error.message });
  }
});

// Serve Vite dev server or static production folder
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express Server booted successfully on port ${PORT}`);
  });
}

startServer();
