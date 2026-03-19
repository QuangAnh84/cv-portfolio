# Build stage
FROM maven:3.9-eclipse-temurin-17 AS builder

# Move into the backend folder inside the container
WORKDIR /app/backend

# Copy backend project into the container
COPY backend/pom.xml .
COPY backend/src ./src

# Build
RUN mvn clean package -DskipTests


# Runtime stage
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# Copy jar from the correct location
COPY --from=builder /app/backend/target/*.jar app.jar

# Railway passes PORT as env variable
EXPOSE 8080
ENTRYPOINT ["java", "-Dserver.port=${PORT:-8080}", "-jar", "app.jar"]
