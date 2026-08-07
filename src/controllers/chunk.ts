import Elysia from "elysia";
import { ChunkService } from "../services/chunk.service";
import { DocumentsRepository } from "../repositories/documents.repository";

const repo = new DocumentsRepository();
const chunk = new ChunkService(repo);

export const ChunkController = new Elysia({ prefix: "/chunk" })
    .get('/save', async () => {
        const result = await chunk.processAndSave();
        return result;
    });