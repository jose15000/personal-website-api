import { describe, it, expect, spyOn } from "bun:test";
import { RetrieveService } from "../../src/services/retrieve.service";

describe("RetrieveService", () => {
    it("should call findSimilar and return documents", async () => {
        const mockDocuments = [{ id: 1, type: "project" as const, title: "Test", content: "Test Content", metadata: {}, embedding: [0.1], similarity: 0.10 }];

        const retrieveService = new RetrieveService();
        const execSpy = spyOn(retrieveService, "exec").mockResolvedValue(mockDocuments as any);

        const result = await retrieveService.exec("my query", "pt-BR");

        expect(execSpy).toHaveBeenCalledWith("my query", "pt-BR");
        expect(result).toEqual(mockDocuments);
        
        execSpy.mockRestore();
    });
});



