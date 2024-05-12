# frontend/Dockerfile

# Use the official Node.js image for building the app
FROM node:21 AS build

# Set the working directory
WORKDIR /frontend

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire source code and build it
COPY . .
RUN npm run build

# Use the Nginx image to serve the static files
FROM nginx:alpine
COPY --from=build /frontend/build /usr/share/nginx/html
EXPOSE 80
