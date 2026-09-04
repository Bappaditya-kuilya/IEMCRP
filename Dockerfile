FROM node:22-alpine AS base

# ── Backend ───────────────────────────────────────────────
FROM base AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/ ./

# ── Frontend ──────────────────────────────────────────────
FROM base AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npx vite build

# ── Production ────────────────────────────────────────────
FROM node:22-alpine
RUN apk add --no-cache tini
WORKDIR /app

COPY --from=backend /app/backend/node_modules ./backend/node_modules
COPY --from=backend /app/backend/server.js ./backend/
COPY --from=backend /app/backend/package.json ./backend/
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 3000

# Serve static frontend from dist via backend
CMD ["node", "backend/server.js"]
