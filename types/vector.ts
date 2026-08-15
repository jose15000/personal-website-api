import { customType } from "drizzle-orm/pg-core/columns";

export const vector = customType<{ data: number[], driverData: string }>({
    dataType() {
        // pgvector doesn't support dimension modifiers in the type
        return 'vector';
    },
    toDriver(value: number[] | string) {
        if (typeof value === "string") {
            return value;
        }
        if (Array.isArray(value)) {
            return JSON.stringify(value);
        }
        return JSON.stringify(value);
    },
    fromDriver(value: unknown) {
        if (typeof value === "string") {
            try {
                return JSON.parse(value);
            } catch {
                return [];
            }
        }
        if (Array.isArray(value)) {
            return value;
        }
        return [];
    }
});
