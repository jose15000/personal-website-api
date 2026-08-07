import { describe, it, expect, mock, beforeEach } from "bun:test";
import { RetrieveService } from "../../src/services/retrieve.service";
import { EmbbedingService } from "../../src/services/embedding.service";
import { DocumentsRepository } from "../../src/repositories/documents.repository";

describe("RetrieveService", () => {
    let retrieveService: RetrieveService;
    let embbedingService: EmbbedingService;
    let documentsRepository: DocumentsRepository;

    beforeEach(() => {
        embbedingService = new EmbbedingService();
        documentsRepository = new DocumentsRepository();
        retrieveService = new RetrieveService(embbedingService, documentsRepository);
    });

    it("should call embbed and findSimilar and return documents", async () => {
        const mockEmbedding = [0.1, 0.2, 0.3];
        const mockDocuments = [{ id: 1, type: "project" as const, title: "Test", content: "Test Content", metadata: {}, embedding: mockEmbedding }];

        // Mock methods
        embbedingService.embbed = mock().mockResolvedValue(mockEmbedding);
        documentsRepository.findSimilar = mock().mockResolvedValue(mockDocuments);

        const result = await retrieveService.exec("my query");

        expect(embbedingService.embbed).toHaveBeenCalledWith("my query");
        expect(documentsRepository.findSimilar).toHaveBeenCalledWith(mockEmbedding);
        expect(result).toEqual(mockDocuments);
    });
});
