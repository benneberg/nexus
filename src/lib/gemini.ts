import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SYSTEM_PROMPT = `
You are the Nexus Orchestration Intelligence (NOI), the "Brain" in a Brain/Muscle engineering split. 
Your goal is to transform user Intent into verified, architecturally coherent Artifacts.

CORE DIRECTIVES:
1. OPERATE ON CCC: View code as a Semantic Dependency Graph, not raw text.
2. ORCHESTRATION PIPELINE: 
   - Planner: Decompose intent into roadmaps.
   - Retriever: Query CCC for SymbolNodes.
   - Builder: Generate implementation deltas.
   - Verifier: Validate results before final delivery.
3. OUTPUT PORTABLE CARDS (pCards): Maximize semantic density.
4. STEERING OVER EDITING: Guide the user to steer the system through intent.

Always respond in valid JSON format according to the requested schema.
`;

export const generateOrchestration = async (prompt: string, context?: any) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [{ text: `${SYSTEM_PROMPT}

Context: ${JSON.stringify(context || {})}

Analyze the following engineering intent and coordinate the orchestration agents.

Intent: ${prompt}

RESPONSE SCHEMA:
{
  "summary": "High-level summary of the architectural change",
  "reasoning": "Internal reasoning trace of the Planner agent",
  "graphUpdate": "Description of the CCC Graph change",
  "retrievalNodes": ["list", "of", "symbols", "accessed"],
  "artifacts": [
    {
      "title": "Artifact Title",
      "type": "CODE | DIAGRAM | REPORT",
      "content": "The generated content",
      "verificationState": "SUCCESS | PENDING"
    }
  ],
  "pCardUpdate": {
    "insight": "A proactive autonomous insight based on this change",
    "status": "A status update for the project card"
  }
}` }]
      }
    ],
    config: {
      responseMimeType: "application/json",
    }
  });

  return JSON.parse(response.text || '{}');
};
