import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

export const db = drizzle(process.env.DATABASE_URL!);

export async function initDb(): Promise<void> {
    try {
        await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector;`);
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS "profile" (
                "id" serial PRIMARY KEY,
                "title" text,
                "content" text,
                "type" text,
                "metadata" json,
                "embedding" vector NOT NULL
            );
        `);
        await db.execute(sql`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name='profile' AND column_name='embbeding'
                ) THEN
                    ALTER TABLE "profile" RENAME COLUMN "embbeding" TO "embedding";
                END IF;
            END $$;
        `);
        console.log("Banco de dados inicializado com sucesso!");
    } catch (error) {
        console.error("Erro ao inicializar o banco de dados:", error);
    }
}
