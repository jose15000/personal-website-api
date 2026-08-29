import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { professionalProfileTable } from "../schemas/schema";

export class DocumentsRepository {
    async findByType(type: "project" | "experience") {
        return await db.select()
            .from(professionalProfileTable)
            .where(eq(professionalProfileTable.type, type));
    }

    async findSimilar(embbeding: number[], limit = 5, locale?: string) {

        try {

            const similarity = sql<number>`(${professionalProfileTable.embedding} <=> ${JSON.stringify(embbeding)}::vector)`;

            let query = db.select({
                id: professionalProfileTable.id,
                title: professionalProfileTable.title,
                content: professionalProfileTable.content,
                type: professionalProfileTable.type,
                locale: professionalProfileTable.locale,
                metadata: professionalProfileTable.metadata,
                embedding: professionalProfileTable.embedding,
                similarity: similarity
            })
                .from(professionalProfileTable)
                .orderBy(similarity);

            if (locale) {
                // Filter by exact match or normalized prefix (e.g. pt match pt-BR if needed, or exact locale)
                const baseLocale = locale.split('-')[0];
                return await query
                    .where(
                        sql`${professionalProfileTable.locale} IS NULL OR ${professionalProfileTable.locale} = ${locale} OR ${professionalProfileTable.locale} LIKE ${baseLocale + '%'}`
                    )
                    .limit(limit);
            }

            return await query
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
        return await db.delete(professionalProfileTable);
    }
}