# Usa una imagen base de OpenJDK para Java 17
FROM openjdk:17-jdk
LABEL authors="ESPACIO TI"

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo JAR con el nombre correcto
COPY target/login-microsoft365-1.0.0.jar app.jar

# Opcional: si usas application.properties y lo quieres copiar
COPY src/main/resources/application.properties application.properties

# Expone el puerto 8080 (ajústalo si tu app usa otro)
EXPOSE 8080

# Ejecuta la app
CMD ["java", "-Djava.awt.headless=true", "-jar", "app.jar"]
