
# ETAPA 1: Construir el proyecto Spring Boot
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copiar la configuración de Maven
COPY pom.xml .

# Descargar dependencias
RUN mvn -B dependency:go-offline

# Copiar el código fuente
COPY src ./src

# Compilar y generar el JAR
RUN mvn -B clean package -DskipTests


# ETAPA 2: Ejecutar la aplicación
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copiar el JAR generado
COPY --from=build /app/target/banco-semillas-api-1.0.0.jar app.jar

# Puerto de Spring Boot
EXPOSE 8080

# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
