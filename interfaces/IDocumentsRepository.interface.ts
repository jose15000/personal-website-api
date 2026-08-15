export interface IDocumentsRepository {
    findByType?(): Promise<string>;
    findSimilar?(): Promise<number[]>
    id?: number;
    title?: string;
    content?: string;
    type?: "project" | "experience";
    metadata?: {};
    embedding?: number[];
}