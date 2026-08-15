import { describe, test, expect, spyOn, beforeEach } from "bun:test";
import { LlmService } from "../../src/services/llm.service";
import { RetrieveService } from "../../src/services/retrieve.service";

describe("LlmService", () => {
    beforeEach(() => {
        process.env.GROQ_API_KEY = "test_key_123";
    });

    test("should execute LLM prompt using Groq SDK with correct payload", async () => {
        const llmService = new LlmService();
        
        const createSpy = spyOn((llmService as any).groq.chat.completions, "create").mockResolvedValue({
            id: "chatcmpl-mock-id",
            object: "chat.completion",
            created: 1234567,
            model: "llama-3.3-70b-versatile",
            choices: [
                {
                    index: 0,
                    message: {
                        role: "assistant",
                        content: "Resposta mockada para o teste!"
                    },
                    finish_reason: "stop"
                }
            ],
            usage: { prompt_tokens: 10, completion_tokens: 10, total_tokens: 20 }
        } as any);

        spyOn(RetrieveService.prototype, "exec").mockResolvedValue([] as any);

        const mockInput = {
            prompt: "Um teste de prompt",
            userEntry: "Uma entrada de usuario de teste"
        };

        const result = await llmService.chat(mockInput);

        expect(createSpy).toHaveBeenCalledTimes(1);
        
        expect(createSpy).toHaveBeenCalledWith({
            messages: [
                {
                    role: "system",
                    content: expect.any(String)
                },
                {
                    role: "user",
                    content: mockInput.userEntry
                }
            ],
            model: "llama-3.3-70b-versatile"
        });
    
        expect(result.choices[0].message.content).toBe("Resposta mockada para o teste!");
    });
});
