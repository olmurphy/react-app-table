# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed app dependencies
RUN npm install

# Copy the application source code to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Define environment variable
ENV PORT 3000

# Define the command to run your application
CMD [ "node", "server.js" ]