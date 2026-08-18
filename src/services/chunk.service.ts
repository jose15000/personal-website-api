import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ReadMarkdown } from "../../utils/readMarkdown";
import { EmbbedingServiceFactory } from "../factories/embbedService.factory";
import { DocumentsRepository } from "../repositories/documents.repository";
import { IDocumentToSave } from "../../interfaces/IDocumentToSave";
import matter from "gray-matter";

export class ChunkService {
    constructor(private documentsRepo: DocumentsRepository) { }

    async processAndSave(): Promise<IDocumentToSave[]> {
        const getMarkdowns = await ReadMarkdown();
        const embbedingService = await EmbbedingServiceFactory();

        // Usamos o LangChain em TypeScript que é bem mais leve e já está instalado
        const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
            chunkSize: 800,
            chunkOverlap: 50,
        });

        const documentsToSave: IDocumentToSave[] = [];

        console.log("Iniciando processamento dos markdowns via LangChain (TypeScript)...");

        // Limpa a base anterior para evitar chunks duplicados ou velhos
        await this.documentsRepo.deleteAll();
        console.log("Base de dados limpa com sucesso!");

        for (const text of getMarkdowns) {
            if (text === "erro") continue;

            const { data, content } = matter(text);

            const chunks = await splitter.createDocuments([content]);

            for (const chunk of chunks) {
                // Remove espaços em branco em excesso
                const cleanContent = chunk.pageContent.trim();

                // Ignora chunks extremamente pequenos que são apenas um título isolado (ex: "# Experiência profissional" com 26 chars)
                if (cleanContent.length < 40) {
                    continue;
                }

                // Enriquecimento de Contexto: Inclui as perguntas prováveis para aproximar a similaridade vetorial das consultas dos usuários
                const questionsText = Array.isArray(data.probable_questions)
                    ? `Perguntas Frequentes Relacionadas:\n- ${data.probable_questions.join("\n- ")}\n\n`
                    : "";

                const textToEmbbed = `Documento: ${data.title}\nTipo: ${data.type}\n${questionsText}Conteúdo:\n${cleanContent}`;

                // O modelo "multilingual-e5-small" EXIGE o prefixo "passage: " para documentos e "query: " para buscas.
                // Isso melhora DRASTICAMENTE a qualidade do retrieval.
                const embeddingVector = await embbedingService.embbed(`passage: ${textToEmbbed}`);

                documentsToSave.push({
                    title: data.title,
                    type: data.type, 
                    content: textToEmbbed,
                    embedding: embeddingVector
                });
            }
        }

        console.log(`Processamento concluído. ${documentsToSave.length} chunks prontos para o banco.`);

        if (documentsToSave.length > 0) {
            await this.documentsRepo.saveMany(documentsToSave);
        }

        return documentsToSave;
    }
}
