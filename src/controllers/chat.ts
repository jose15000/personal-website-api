import Elysia, { t } from "elysia";
import { LlmService } from "../services/llm.service";
import { ILlm } from "../../interfaces/llm.interface";

const llmService = new LlmService();

export const ChatController = new Elysia({ prefix: "/chat" })
    .post("/", async ({ body }) => {
        return await llmService.chat(body);
    }, {
        body: t.Object({
            prompt: t.String(),
            userEntry: t.Optional(t.String())
        })
    });
