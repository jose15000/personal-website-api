import { describe, it, expect, mock, beforeEach } from "bun:test";

const mockWhere = mock();
const mockLimit = mock();
const mockOrderBy = mock().mockReturnValue({ limit: mockLimit });
const mockFrom = mock().mockImplementation(() => ({
    where: mockWhere,
    orderBy: mockOrderBy
}));
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
        mockSelect.mockClear();
        mockFrom.mockClear();
        mockWhere.mockClear();
        mockOrderBy.mockClear();
        mockLimit.mockClear();
    });

    it("should find documents by type", async () => {
        mockWhere.mockResolvedValueOnce([{ id: 1, type: "project" }]);

        await repository.findByType("project");

        expect(mockSelect).toHaveBeenCalled();
        expect(mockFrom).toHaveBeenCalled();
        expect(mockWhere).toHaveBeenCalled();
    });

    it("should find similar documents using embedding array", async () => {
        mockLimit.mockResolvedValueOnce([{ id: 2 }]);

        const embedding = [0.1, 0.2, 0.3];
        await repository.findSimilar(embedding, 5);

        expect(mockSelect).toHaveBeenCalled();
        expect(mockFrom).toHaveBeenCalled();
        expect(mockOrderBy).toHaveBeenCalled();
        expect(mockLimit).toHaveBeenCalledWith(5);
    });
});
