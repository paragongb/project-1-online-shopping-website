FROM node:24 AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG APP_VERSION=0.0.1-SNAPSHOT
RUN APP_VERSION=$APP_VERSION npm run webapp:prod

FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
COPY --from=frontend /app/target/classes/static /app/target/classes/static
RUN mvn -B -ntp -Pprod -DskipTests -Dskip.npm=true -Dskip.installnodenpm=true -Dmaven.gitcommitid.skip=true package
RUN cp target/project-1-online-shopping-website-*.jar /app/app.jar

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/app.jar /app/app.jar
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=60.0", "-jar", "/app/app.jar"]
