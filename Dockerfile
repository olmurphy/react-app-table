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


omurphy@FVFHC4M3Q6LR react-app-table % docker bui
ld .
[+] Building 37.3s (4/9)                                                                  docker:desktop-linux
[+] Building 37.3s (6/9)                                                                  docker:desktop-linux
 => [internal] load build definition from Dockerfile                                                      0.0s
 => => transferring dockerfile: 551B                                                                      0.0s
 => [internal] load metadata for docker.io/library/node:18-alpine                                         2.4s
 => [internal] load .dockerignore                                                                         0.0s
 => => transferring context: 2B                                                                           0.0s
 => [1/5] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a3  34.9s
 => => resolve docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35  0.0s1
 => => sha256:02bb84e9f3412827f177bc6c020812249b32a8425d2c1858e9d71bd4c015f031 443B / 443B                0.1s
 => => sha256:8bfa36aa66ce614f6da68a16fb71f875da8d623310f0cb80ae1ecfa092f587f6 1.26MB / 1.26MB            5.2s
 => => sha256:d84c815451acbca96b6e6bdb479929222bec57121dfe10cc5b128c5c2dbaf10a 16.78MB / 39.66MB         34.8s
 => => sha256:6e771e15690e2fabf2332d3a3b744495411d6e0b00b2aea64419b58b0066cf81 3.99MB / 3.99MB            1.7s
 => => extracting sha256:6e771e15690e2fabf2332d3a3b744495411d6e0b00b2aea64419b58b0066cf81                 0.1s
 => [internal] load build context                                                                         0.2s
 => => transferring context: 705.89kB                                                                     0.2s