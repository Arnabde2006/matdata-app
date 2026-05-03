FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY frontend/package.json ./frontend/
RUN cd frontend && npm install --legacy-peer-deps
COPY frontend/ ./frontend/
RUN cd frontend && npm run build
COPY backend/package.json ./backend/
RUN cd backend && npm install --legacy-peer-deps
COPY backend/ ./backend/
RUN cp -r frontend/dist backend/public
WORKDIR /app/backend
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/server.js"]
