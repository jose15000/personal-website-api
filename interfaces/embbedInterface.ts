export interface IEmbbed {
    initialize(): Promise<void>;
    embbed(text: string): Promise<number[]>;
}