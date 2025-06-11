# FROM node:18-alpine AS base
# WORKDIR /app

# # Dependencias nativas (canvas, etc) si las requieres aquí tambien:
# RUN apk add --no-cache \
#     python3 make g++ \
#     cairo-dev jpeg-dev pango-dev giflib-dev pkgconfig

# COPY package*.json ./
# RUN npm ci

# COPY . .

# # 2) Stage de desarrollo: reutiliza base y arranca `npm run dev`
# FROM base AS dev
# EXPOSE 3000
# CMD ["npm", "run", "dev"]

# # 3) Stage de build/producción: compila y sirve con nginx
# FROM base AS build
# RUN npm run build

# FROM nginx:stable-alpine AS prod
# COPY --from=build /app/out /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
