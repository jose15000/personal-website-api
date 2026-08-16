import Elysia, { t } from "elysia";
import { LlmService } from "../services/llm.service";

const llmService = new LlmService();

export const ChatController = new Elysia({ prefix: "/chat" })
    .post("/", async ({ body }) => {
        return await llmService.chat(body);
    }, {
        body: t.String()
    });
