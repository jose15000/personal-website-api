import { ILlm } from "../../interfaces/llm.interface";
import Groq from "groq-sdk";
import { RetrieveService } from "./retrieve.service";
import { basicPrompt, contextPrompt } from "../../utils/prompts";
export class LlmService {

    private retrieve = new RetrieveService();
    private groq = new Groq({ apiKey: Bun.env.GROQ_API_KEY! })

    async chat(input: string) {

        const gatherKnowledge = await this.retrieve.exec(input);
        
        console.log("=== Resultados do Retrieval ===");
        gatherKnowledge?.forEach((k, i) => {
            console.log(`[${i}] similaridade: ${k.similarity} - ${k.title}`);
            console.log(`    -> ${k.content?.substring(0, 80)}...`);
        });

        const relevantChunks = gatherKnowledge?.filter(k => (k.similarity as number) < 0.35) || [];

        if (relevantChunks.length === 0) {
            return await this.groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: basicPrompt(input)
                    }
                ],
                model: "llama-3.3-70b-versatile"
            });
        }

        const combinedContext = relevantChunks.map(c => c.content).join('\n\n---\n\n');

        return await this.groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: contextPrompt(combinedContext, input)
                }
            ],
            model: "llama-3.3-70b-versatile"
        });

    }
}