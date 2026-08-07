import { describe, it, expect, mock, beforeEach } from "bun:test";

const mockPipelineResult = mock().mockResolvedValue({
    data: [0.1, 0.2, 0.3, 0.4] // Simulating Float32Array or standard array
});
const mockPipeline = mock().mockResolvedValue(mockPipelineResult);

mock.module("@huggingface/transformers", () => ({
    pipeline: mockPipeline
}));

import { EmbbedingService } from "../../src/services/embedding.service";

describe("EmbbedingService", () => {
    let embbedingService: EmbbedingService;

    beforeEach(() => {
        embbedingService = new EmbbedingService();
        mockPipeline.mockClear();
        mockPipelineResult.mockClear();
    });

    it("should initialize the extractor correctly", async () => {
        await embbedingService.initialize();
        
        expect(mockPipeline).toHaveBeenCalledWith(
            "feature-extraction",
            "Xenova/multilingual-e5-base",
            { device: "cpu" }
        );
    });

    it("should embed text and return number array", async () => {
        await embbedingService.initialize();
        
        const text = "hello world";
        const result = await embbedingService.embbed(text);

        expect(mockPipelineResult).toHaveBeenCalledWith(text, {
            pooling: "mean",
            normalize: true
        });
        
        expect(result).toEqual([0.1, 0.2, 0.3, 0.4]);
    });
});
