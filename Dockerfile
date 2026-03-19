# Dockerfile for Java Backend

# Use an official Java runtime as a parent image
FROM openjdk:11-jre-slim

# Set the working directory
WORKDIR /app

# Copy the local pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the Maven project
RUN mvn clean package -DskipTests

# Set the command to run the application
CMD ["java", "-jar", "target/your-application.jar"]
