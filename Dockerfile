# Optional: only needed if you deploy the frontend as a container (e.g. on
# Render/Fly.io). For free static hosts (Vercel/Netlify/Cloudflare Pages)
# you don't need this file at all — they build straight from the repo.

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Bake the API URL in at build time since Vite env vars are compiled into
# the static bundle, not read at container runtime.
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
