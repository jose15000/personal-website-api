import { json, serial, text } from "drizzle-orm/pg-core/columns";
import { pgTable } from "drizzle-orm/pg-core/table";
import { vector } from "../../types/vector";

export const professionalProfileTable = pgTable("profile", {
    id: serial().primaryKey(),
    title: text(),
    content: text(),
    type: text({ enum: ["project", "experience", "profile"] }),
    metadata: json(),
    embbeding: vector(384).notNull()
})