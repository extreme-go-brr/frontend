# --- Build Stage ---
FROM node:22-alpine AS build

WORKDIR /app

# Install dependency dasar
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy semua file project (bukan hanya package.json)
COPY . .

# Install dependencies (akan jalan quasar prepare, tapi sekarang project sudah ada)
RUN npm install

# Build Quasar (output default ke /app/dist/spa)
RUN npm run build

# --- Production Stage ---
FROM nginx:alpine

# Copy hasil build ke nginx html folder
COPY --from=build /app/dist/spa /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
