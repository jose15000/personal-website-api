import { eq, sql } from "drizzle-orm";
import { db } from "..";
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
            console.error(JSON.stringify(e, null, 2))
        }

    }
    async save(data: typeof professionalProfileTable.$inferInsert) {
        return await db.insert(professionalProfileTable)
            .values(data)
            .returning();
    }

    async saveMany(data: (typeof professionalProfileTable.$inferInsert)[]) {
        return await db.insert(professionalProfileTable)
            .values(data)
            .returning();
    }

    async deleteAll() {
        return await db.delete(professionalProfileTable);
    }
}