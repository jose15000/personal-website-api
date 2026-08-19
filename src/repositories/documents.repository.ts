import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { professionalProfileTable } from "../schemas/schema";

export class DocumentsRepository {
    async findByType(type: "project" | "experience") {
        return await db.select()
            .from(professionalProfileTable)
            .where(eq(professionalProfileTable.type, type));
    }

    async findSimilar(embbeding: number[], limit = 5) {

        try {

            const similarity = sql<number>`(${professionalProfileTable.embedding} <=> ${JSON.stringify(embbeding)}::vector)`;

            return await db.select({
                id: professionalProfileTable.id,
                title: professionalProfileTable.title,
                content: professionalProfileTable.content,
                type: professionalProfileTable.type,
                metadata: professionalProfileTable.metadata,
                embedding: professionalProfileTable.embedding,
                similarity: similarity
            })
                .from(professionalProfileTable)
                .orderBy(similarity)
                .limit(limit);
        } catch (e) {
            console.error("Error finding similar documents:", e);
        }

    }
    async save(data: typeof professionalProfileTable.$inferInsert) {
        try {
            return await db.insert(professionalProfileTable)
                .values(data)
                .returning();
        } catch (error) {
            console.error("Erro ao salvar documento:", error instanceof Error ? error.message : error);
            throw error;
        }
    }

    async saveMany(data: (typeof professionalProfileTable.$inferInsert)[]) {
        try {
            return await db.insert(professionalProfileTable)
                .values(data)
                .returning();
        } catch (error) {
            console.error("Erro ao salvar múltiplos documentos (saveMany):", error instanceof Error ? error.message : error);
            throw error;
        }
    }

    async deleteAll() {
        try {
            const result = await db.delete(professionalProfileTable);
            console.log("Profile table cleared successfully");
            return result;
        } catch (error) {
            console.error("Error clearing profile table:", {
                message: error instanceof Error ? error.message : String(error),
                error: JSON.stringify(error, null, 2)
            });
            throw error;
        }
    }
}