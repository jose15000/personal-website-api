import { Elysia, t } from "elysia";
import { EmbbedingServiceFactory } from "../factories/embbedService.factory";

export const embbedController = new Elysia({ prefix: "/embbed" })
    .decorate("getEmbbedService", EmbbedingServiceFactory)
    .post('/', async ({ body, getEmbbedService }) => {
        const embbedService = await getEmbbedService();
        return await embbedService.embbed(body.query);
    }, {
        body: t.Object({
            query: t.String()
        })
    })