import { describe, it, expect, mock, beforeEach } from "bun:test";

const mockResult = [{ id: 1, type: "project" }];
const mockLimit = mock().mockResolvedValue(mockResult);
const mockWhere = mock().mockImplementation((...args: any[]) => {
    const promise = Promise.resolve(mockResult) as any;
    promise.limit = mockLimit;
    return promise;
});
const mockOrderBy = mock().mockReturnValue({ where: mockWhere, limit: mockLimit });
const mockFrom = mock().mockReturnValue({
    where: mockWhere,
    orderBy: mockOrderBy
});
const mockSelect = mock().mockReturnValue({ from: mockFrom });

mock.module("../../src/db", () => ({
    db: {
        select: mockSelect,
    }
}));

import { DocumentsRepository } from "../../src/repositories/documents.repository";

describe("DocumentsRepository", () => {
    let repository: DocumentsRepository;

    beforeEach(() => {
        repository = new DocumentsRepository();
    });

    it("should find documents by type", async () => {
        const result = await repository.findByType("project");

        expect(mockSelect).toHaveBeenCalled();
        expect(result).toEqual(mockResult as any);
    });

    it("should find similar documents using embedding array", async () => {
        const embedding = [0.1, 0.2, 0.3];
        const result = await repository.findSimilar(embedding, 5, "en");

        expect(mockSelect).toHaveBeenCalled();
        expect(result).toEqual(mockResult as any);
    });
});


