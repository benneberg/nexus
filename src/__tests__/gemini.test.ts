import { describe, test, expect, vi, beforeEach } from 'vitest';
import { generateOrchestration } from '../lib/gemini';

describe('Gemini Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should parse valid JSON response from Gemini', async () => {
    const mockResponse = {
      summary: "Updated auth logic",
      reasoning: "User requested better auth",
      graphUpdate: "Added auth node",
      artifacts: [{ title: "auth.ts", type: "CODE", content: "export const auth = () => {}", verificationState: "SUCCESS" }]
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as any);

    const result = await generateOrchestration("Implement auth");
    
    expect(result.summary).toBe("Updated auth logic");
    expect(result.artifacts[0].title).toBe("auth.ts");
  });

  test('should throw error if API key is missing', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: "GEMINI_API_KEY is not set." }),
    } as any);

    await expect(generateOrchestration("Implement auth")).rejects.toThrow("GEMINI_API_KEY is not set.");
  });

  test('should return empty object if response text is empty', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as any);

    const result = await generateOrchestration("Implement auth");
    expect(result).toEqual({});
  });
});
