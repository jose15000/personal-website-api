import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

export const db = drizzle(process.env.DATABASE_URL!);

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
                "metadata" json,
                "embedding" vector NOT NULL
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
                    ALTER TABLE "profile" ADD COLUMN "embedding" vector NOT NULL;
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
                    WHERE table_name='profile' AND column_name='embedding' AND data_type != 'USER-DEFINED'
                ) THEN
                    ALTER TABLE "profile" ALTER COLUMN "embedding" TYPE vector USING "embedding"::vector;
                END IF;
            END $$;
        `);
    } catch (error) {
        console.error("Erro ao alterar tipo da coluna 'embedding' para vector:", error);
    }

    console.log("Banco de dados pronto e alinhado!");
}
