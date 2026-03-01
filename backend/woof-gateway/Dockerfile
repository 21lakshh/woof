# Stage 1: Build
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .

# In case the wrapper doesn't exist, we fallback or just use maven directly. 
# Better: copy the mvnw from another existing project
# Assuming docker build context is the gateway folder, we will rely on existing maven.
# Wait, actually, the user doesn't have mvnw in woof-gateway right now.
# Let's use maven base image instead to simplify.

FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
