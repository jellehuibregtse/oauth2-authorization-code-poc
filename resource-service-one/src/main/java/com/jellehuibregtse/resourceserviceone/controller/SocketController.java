package com.jellehuibregtse.resourceserviceone.controller;

import com.jellehuibregtse.resourceserviceone.model.Message;
import lombok.extern.log4j.Log4j2;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Log4j2
@Controller
public class SocketController {

    @MessageMapping("/user-all")
    @SendTo("/topic/user")
    public Message send(@Payload Message message) {
        log.info(String.format("%s: %s", message.getName(), message.getMessage()));
        return message;
    }
}