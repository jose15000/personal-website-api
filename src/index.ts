import { Elysia } from "elysia";
import { drizzle } from "drizzle-orm/node-postgres";
import { embbedController } from "./controllers/embbed";
import { EmbbedingServiceFactory } from "./factories/embbedService.factory";
import { retrievalController } from "./controllers/retrieve";
import { ChunkController } from "./controllers/chunk";

export const db = drizzle(process.env.DATABASE_URL!);

console.log("Iniciando carregamento do modelo de IA (pode demorar alguns minutos na primeira vez)...");
await EmbbedingServiceFactory();
console.log("Modelo de IA carregado com sucesso!");

const app = new Elysia()
  .use(embbedController)
  .use(retrievalController)
  .use(ChunkController)
  .get("/", () => "Hello Elysia")
  .listen(3000);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
