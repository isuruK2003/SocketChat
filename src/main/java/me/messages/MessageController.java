package me.messages;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@Controller
public class MessageController {
	@MessageMapping("/sendMessage")
	@SendTo("/topic/messages")
	public Message sendMessage(Message message) {
		return message;
	}
}
