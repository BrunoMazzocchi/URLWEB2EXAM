# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy the project files to the working directory
COPY package*.json ./ 

# Install the application dependencies
RUN npm install

# Install additional dependencies for OpenTelemetry
RUN npm install @opentelemetry/api @opentelemetry/sdk-node

# Copy the application files to the working directory
COPY . .

# Set environment variables
ENV JWT_SECRET=2340238940234
ENV DATABASE_USER=root
ENV DATABASE_PASSWORD=Temporal2021+
ENV DATABASE_HOST=localhost
ENV DATABASE=testexam
# Use an environment variable for the Signoz Ingestion Key
ENV OTEL_EXPORTER_OTLP_HEADERS="signoz-access-token=a893d527-40c9-406b-8f26-a0b8b3547b06"

# Expose the port the app runs on
EXPOSE 3000

# Run the app with the required OpenTelemetry configuration. app.js is your application main file.
CMD ["node", "-r", "./tracing.js", "src/app.js"]