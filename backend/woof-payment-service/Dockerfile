# Stage 1: Build
# Use a Maven image with Java 21 (Alpine Linux for small size)
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copy the project files
COPY . .

# Build the application (skip tests for speed)
# Ensure the wrapper is executable
RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

# Stage 2: Run
# Use a lightweight JRE image for running the app
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy only the compiled JAR from Stage 1
COPY --from=build /app/target/*.jar app.jar

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
