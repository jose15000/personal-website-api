
export interface PythonChunk {
    title: string;
    type: "project" | "experience" | "profile";
    content: string;
    metadata: Record<string, string>;
    embedding: number[];
}