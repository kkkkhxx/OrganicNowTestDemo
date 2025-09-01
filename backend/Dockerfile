# ===== Build stage (Gradle) =====
FROM gradle:8.9-jdk17 AS build
WORKDIR /app
# คัดลอกไฟล์โปรเจกต์ทั้งหมดเข้าไป (รวม build.gradle, settings.gradle, src/)
COPY . .
# สร้างไฟล์ JAR (ใช้ bootJar ของ Spring Boot)
RUN gradle -q clean bootJar --no-daemon

# ===== Run stage (JRE) =====
FROM eclipse-temurin:17-jre
WORKDIR /app
# คัดลอก JAR จากสเตจ build มาไว้ในอิมเมจรันจริง
COPY --from=build /app/build/libs/*.jar app.jar

# ใช้โปรไฟล์ docker (ไปอ่าน application-docker.properties)
ENV SPRING_PROFILES_ACTIVE=docker
EXPOSE 8080

ENTRYPOINT ["java","-jar","/app/app.jar"]
