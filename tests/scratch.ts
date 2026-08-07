import { pipeline } from "@huggingface/transformers";
console.log("Starting pipeline...");
const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", { device: "cpu" });
console.log("Extractor type:", typeof extractor);
console.log("Extractor:", extractor);
