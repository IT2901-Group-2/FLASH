FROM node:lts-alpine
WORKDIR /opt/flash

RUN apk add fontconfig font-dejavu ttf-freefont

ENV CI=true
RUN corepack enable pnpm

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build

EXPOSE 3000
CMD ["pnpm", "run", "start"]
