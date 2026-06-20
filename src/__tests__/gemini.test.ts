import { describe, test, expect, vi, beforeEach } from 'vitest';
import { generateOrchestration } from '../lib/gemini';
import { GoogleGenAI } from "@google/genai";

vi.mock("@google/genai", () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: vi.fn()
      }
    }))
  };
});

describe('Gemini Logic', () => {
  const mockGenerateContent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Re-mock implementation to get access to the specific mock function
    (GoogleGenAI as any).mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent
      }
    }));
    
    // Set environment variable for test
    process.env.GEMINI_API_KEY = 'test-key';
  });

  test('should parse valid JSON response from Gemini', async () => {
    const mockResponse = {
      text: JSON.stringify({
        summary: "Updated auth logic",
        reasoning: "User requested better auth",
        graphUpdate: "Added auth node",
        artifacts: [{ title: "auth.ts", type: "CODE", content: "export const auth = () => {}", verificationState: "SUCCESS" }]
      })
    };
    
    mockGenerateContent.mockResolvedValue(mockResponse);

    const result = await generateOrchestration("Implement auth");
    
    expect(result.summary).toBe("Updated auth logic");
    expect(result.artifacts[0].title).toBe("auth.ts");
  });

  test('should throw error if API key is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    
    await expect(generateOrchestration("Implement auth")).rejects.toThrow("GEMINI_API_KEY is not set.");
  });

  test('should return empty object if response text is empty', async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    mockGenerateContent.mockResolvedValue({ text: "" });

    const result = await generateOrchestration("Implement auth");
    expect(result).toEqual({});
  });
});
