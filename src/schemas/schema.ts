import { json, serial, text, vector } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core/table";

export const professionalProfileTable = pgTable("profile", {
    id: serial().primaryKey(),
    title: text(),
    content: text(),
    type: text({ enum: ["project", "experience", "profile"] }),
    locale: text(),
    metadata: json(),
    embedding: vector("embedding", { dimensions: 384 }).notNull()
});