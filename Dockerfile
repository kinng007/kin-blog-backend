#Each instruction in this file creates a new layer
#Here we are getting our node as Base image
FROM node:latest
#Creating a new directory for app files and setting path in the container
RUN mkdir -p /usr/src/app
#setting working directory in the container
WORKDIR /usr/src/app
#copying the source code of Application into the container dir
COPY . /usr/src/app
# installing the dependencies into the container
RUN npm install
# Generate the build of the application
RUN npm run build
#RUN ls -ltr
#container exposed network port number
EXPOSE 3000
#command to run within the container
ENTRYPOINT node /usr/src/app/index.js
