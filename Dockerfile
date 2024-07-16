FROM amazoncorretto:17-alpine-jdk

# Install bash
RUN apk add --no-cache bash


# Copy the application JAR
COPY target/TopShop-V.jar TopShop-V.jar

# Copy wait-for-it script
COPY wait-for-it.sh /wait-for-it.sh

# Make wait-for-it script executable
RUN chmod +x /wait-for-it.sh

# Set the entrypoint to wait for MySQL before starting the application
ENTRYPOINT ["/wait-for-it.sh", "mysql", "3306", "--", "java", "-jar", "/TopShop-V.jar"]
