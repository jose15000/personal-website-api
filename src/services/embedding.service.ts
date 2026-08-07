import {
    FeatureExtractionPipeline,
    pipeline
} from "@huggingface/transformers";
import { IEmbbed } from "../../interfaces/embbedInterface";

export class EmbbedingService
    implements IEmbbed {

    private extractor!: FeatureExtractionPipeline;

    async initialize() {
        this.extractor = await pipeline(
            "feature-extraction",
            "Xenova/multilingual-e5-small",
            {
                device: "cpu"
            }
        );
    }

    async embbed(text: string): Promise<number[]> {
        const output = await this.extractor(text, {
            pooling: "mean",
            normalize: true,
        });

        return Array.from(output.data);
    }
}