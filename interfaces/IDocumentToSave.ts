export interface IDocumentToSave {
    title: string;
    content: string;
    type?: "project" | "experience" | "profile";
    embedding: number[];
}

