
import Groq from "groq-sdk";
import { RetrieveService } from "./retrieve.service";
import { basicPrompt, contextPrompt } from "../../utils/prompts";
export class LlmService {

    private retrieve = new RetrieveService();
    private groq = new Groq({ apiKey: Bun.env.GROQ_API_KEY! })

    async chat(input: string, locale?: string) {

        const gatherKnowledge = await this.retrieve.exec(input, locale);

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
                        role: "system",
                        content: basicPrompt(locale),
                    },
                    {
                        role: "user",
                        content: input
                    }
                ],
                model: "openai/gpt-oss-120b"
            });
        }

        const combinedContext = relevantChunks.map(c => c.content).join('\n\n---\n\n');

        return await this.groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: contextPrompt(combinedContext, locale)
                },
                {
                    role: "user",
                    content: input
                }
            ],
            model: "openai/gpt-oss-120b"
        });

    }
}