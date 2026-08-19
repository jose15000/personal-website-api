FROM oven/bun:1-debian AS base
WORKDIR /app

# Instala dependências do sistema necessárias para sharp/@huggingface/transformers
RUN apt-get update && apt-get install -y \
    libstdc++6 \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

# Instala dependências
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copia o restante do código
COPY src/ ./src/
COPY types/ ./types/
COPY interfaces/ ./interfaces/
COPY utils/ ./utils/
COPY documents/ ./documents/
COPY drizzle.config.ts ./
COPY tsconfig.json ./

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
