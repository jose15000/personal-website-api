import { customType } from "drizzle-orm/pg-core/columns";

export const vector = (dimensions: number) => customType<{ data: number[], driverData: string }>({
    dataType() {
        // pgvector doesn't support dimension modifiers in the type
        return 'vector';
    },
    toDriver(value: number[]) {
        // O pgvector requer que os arrays sejam inseridos como strings no formato "[0.1, 0.2, ...]"
        return JSON.stringify(value);
    },
    fromDriver(value: string) {
        // Ao ler do banco, convertemos de volta para um array numérico
        return JSON.parse(value);
    }
});