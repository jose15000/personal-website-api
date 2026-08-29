
import * as fs from 'fs/promises';
import * as path from 'path';


export interface IMarkdownFile {
    content: string;
    locale: string;
}

export async function ReadMarkdown(): Promise<IMarkdownFile[]> {

    const filesData: IMarkdownFile[] = [];
    try {
        const folderPath = path.resolve(__dirname, '..', 'documents');

        console.log(`Buscando explicitamente em: ${folderPath}`);

        const mdFiles = await fs.readdir(folderPath);
        const check = mdFiles.filter(item => path.extname(item).toLowerCase() === ".md");

        for (const file of check) {
            const fullPath = path.join(folderPath, file);
            const read = await fs.readFile(fullPath, 'utf-8');

            console.log(`\n--- Conteúdo do arquivo: ${file} ---`);

            // Detect locale from filename (e.g. profile.en.md -> en, profile.pt-BR.md -> pt-BR)
            const parts = file.split('.');
            let fileLocale = "pt-BR"; // default locale for current document set
            if (parts.length > 2) {
                fileLocale = parts[parts.length - 2];
            }

            filesData.push({
                content: read,
                locale: fileLocale
            });
        }
        return filesData;

    } catch (error) {
        console.error("Erro ao mapear o caminho ou ler os arquivos:", error);
        return [];
    }
}


