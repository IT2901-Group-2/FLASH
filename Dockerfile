FROM node:lts-alpine
WORKDIR /opt/flash

ENV CI=true
RUN corepack enable pnpm

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build

EXPOSE 3000
CMD ["pnpm", "run", "start"]
