import { Elysia } from "elysia";
import { drizzle } from "drizzle-orm/node-postgres";
import { embbedController } from "./controllers/embbed";
import { EmbbedingServiceFactory } from "./factories/embbedService.factory";
import { retrievalController } from "./controllers/retrieve";
import { ChunkController } from "./controllers/chunk";
import { ChatController } from "./controllers/chat";
import cors from "@elysiajs/cors";


console.log("Iniciando carregamento do modelo de IA (pode demorar alguns minutos na primeira vez)...");
await EmbbedingServiceFactory();
console.log("Modelo de IA carregado com sucesso!");

const app = new Elysia()
  .use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
    }),
  )
  .use(embbedController)
  .use(retrievalController)
  .use(ChunkController)
  .use(ChatController)
  .get("/", () => "Hello Elysia")
  .listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
