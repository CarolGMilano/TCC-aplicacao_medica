
# ETAPA 1 — Build com Maven e Java 21
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copia primeiro o pom.xml para aproveitar o cache
COPY pom.xml .

# Baixa as dependências
RUN mvn dependency:go-offline -B

# Copia o código-fonte e compila
COPY src ./src
RUN mvn clean package -DskipTests -B

# ETAPA 2 — Execução com Java 21
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/cervicare-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
