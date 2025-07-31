# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
# This allows Docker to cache the npm install step if only code changes
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
# Your server.js listens on process.env.PORT, which Cloud Run will set to 8080 by default.
EXPOSE 8080

# Run the application
CMD [ "npm", "start" ]