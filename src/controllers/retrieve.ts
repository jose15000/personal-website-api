import Elysia, { t } from "elysia";
import { RetrieveService } from "../services/retrieve.service";

export const retrievalController = new Elysia({ prefix: "/retrieve" })
    .post("/", async ({ body }) => {
        const retrievalService = await new RetrieveService();
        const response = retrievalService.exec(body.query);

        return await response;
    }, {
        body: t.Object({
            query: t.String()
        })
    }


    )
