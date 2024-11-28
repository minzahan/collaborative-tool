# Use Node.js LTS for building and running the frontend
FROM node:18-slim

# Set working directory
WORKDIR /frontend

# Copy dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose frontend port
EXPOSE 3000

# Command to run the frontend
CMD ["npm", "start"]
