import { describe, it, expect, mock, spyOn } from "bun:test";
import { RetrieveService } from "../../src/services/retrieve.service";
import { DocumentsRepository } from "../../src/repositories/documents.repository";
import * as factory from "../../src/factories/embbedService.factory";

describe("RetrieveService", () => {
    it("should call embbed and findSimilar and return documents", async () => {
        const mockEmbedding = [0.1, 0.2, 0.3];
        const mockDocuments = [{ id: 1, type: "project" as const, title: "Test", content: "Test Content", metadata: {}, embedding: mockEmbedding, similarity: 0.10 }];

        const embbedMock = mock().mockResolvedValue(mockEmbedding);
        spyOn(factory, "EmbbedingServiceFactory").mockResolvedValue({ embbed: embbedMock } as any);
        
        const repoSpy = spyOn(DocumentsRepository.prototype, "findSimilar").mockResolvedValue(mockDocuments as any);

        const retrieveService = new RetrieveService();
        const result = await retrieveService.exec("my query");

        expect(embbedMock).toHaveBeenCalledWith("query: my query");
        expect(repoSpy).toHaveBeenCalledWith(mockEmbedding, 5, undefined);
        expect(result).toEqual(mockDocuments);
        repoSpy.mockRestore();
    });
});
