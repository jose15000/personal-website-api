import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

export const db = process.env.DATABASE_URL
    ? drizzle(process.env.DATABASE_URL)
    : {
        select: (...args: any[]) => ({} as any),
        execute: (...args: any[]) => ({} as any),
        insert: (...args: any[]) => ({} as any),
        delete: (...args: any[]) => ({} as any),
    } as unknown as ReturnType<typeof drizzle>;



export async function initDb(): Promise<void> {
    console.log("Inicializando e alinhando schema do banco de dados...");

    try {
        await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector;`);
        console.log("Extensão 'vector' verificada/criada com sucesso.");
    } catch (error) {
        console.warn("Aviso ao criar extensão vector (pode requerer privilégios de superusuário ou já existir):", error);
    }

    try {
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS "profile" (
                "id" serial PRIMARY KEY,
                "title" text,
                "content" text,
                "type" text,
                "locale" text,
                "metadata" json,
                "embedding" vector(384) NOT NULL
            );
        `);
        console.log("Tabela 'profile' verificada/criada.");
    } catch (error) {
        console.error("Erro ao criar tabela 'profile':", error);
    }

    try {
        await db.execute(sql`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name='profile' AND column_name='locale'
                ) THEN
                    ALTER TABLE "profile" ADD COLUMN "locale" text;
                END IF;
            END $$;
        `);
    } catch (error) {
        console.error("Erro ao adicionar coluna 'locale':", error);
    }

    try {
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
    } catch (error) {
        console.error("Erro ao renomear coluna 'embbeding':", error);
    }

    try {
        await db.execute(sql`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name='profile' AND column_name='embedding'
                ) THEN
                    ALTER TABLE "profile" ADD COLUMN "embedding" vector(384) NOT NULL;
                END IF;
            END $$;
        `);
    } catch (error) {
        console.error("Erro ao adicionar coluna 'embedding':", error);
    }

    try {
        await db.execute(sql`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name='profile' AND column_name='embedding'
                ) THEN
                    ALTER TABLE "profile" ALTER COLUMN "embedding" TYPE vector(384) USING "embedding"::vector(384);
                END IF;
            END $$;
        `);
    } catch (error) {
        console.error("Erro ao alterar tipo da coluna 'embedding' para vector:", error);
    }

    console.log("Banco de dados pronto e alinhado!");
}
