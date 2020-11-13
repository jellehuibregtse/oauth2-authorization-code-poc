package com.jellehuibregtse.resourceserviceone.controller;

import lombok.extern.log4j.Log4j2;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.MessageFormat;

@Log4j2
@RestController
@RequestMapping("/resource")
public class ResourceController {

    private final Environment environment;

    public ResourceController(final Environment environment) {
        this.environment = environment;
    }

    @GetMapping("/status/check")
    public String status() {
        var port = environment.getProperty("local.server.port");
        log.info("Resource status check called on port {}", port);

        return MessageFormat.format("Resource service one is working on port {0}!", port);
    }
}
