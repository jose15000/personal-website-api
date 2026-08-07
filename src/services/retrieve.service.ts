import { EmbbedingServiceFactory } from "../factories/embbedService.factory";
import { DocumentsRepository } from "../repositories/documents.repository";

export class RetrieveService {

    async exec(query: string) {
        const embbedingService = await EmbbedingServiceFactory();
        const documentsRepository = new DocumentsRepository();
        // O modelo e5 EXIGE o prefixo "query: " para as buscas do usuário!
        const embed = await embbedingService.embbed(`query: ${query}`);
        const documents = await documentsRepository.findSimilar(embed);
        return documents;
    }
}