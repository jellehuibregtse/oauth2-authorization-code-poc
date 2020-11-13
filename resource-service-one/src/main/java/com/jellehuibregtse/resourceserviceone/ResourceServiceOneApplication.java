package com.jellehuibregtse.resourceserviceone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@EnableEurekaClient
@SpringBootApplication
public class ResourceServiceOneApplication {

    public static void main(String[] args) {
        SpringApplication.run(ResourceServiceOneApplication.class, args);
    }
}
