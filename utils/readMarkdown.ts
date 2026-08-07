
import * as fs from 'fs/promises';
import * as path from 'path';


export async function ReadMarkdown(): Promise<string[]> {

    const text: string[] = [];
    try {
        const folderPath = path.resolve(__dirname, '..', 'documents');

        console.log(`Buscando explicitamente em: ${folderPath}`);

        const mdFiles = await fs.readdir(folderPath);
        const check = mdFiles.filter(item => path.extname(item).toLowerCase() === ".md");

        for (const file of check) {
            const fullPath = path.join(folderPath, file);
            const read = await fs.readFile(fullPath, 'utf-8');

            console.log(`\n--- Conteúdo do arquivo: ${file} ---`);
            console.log(read);

            text.push(read);
        }
        return text

    } catch (error) {
        console.error("Erro ao mapear o caminho ou ler os arquivos:", error);
        return ["erro"];
    }
}

