package me.messages;

public class Message {
	private String sender;
	private String content;

	public Message(String sender, String content) {
		this.sender = sender;
		this.content = content;
	}

	public String getSender() {
		return this.sender;
	}

	public String getContent() {
		return this.content;
	}

	@Override
	public String toString() {
		return "Message{"
			+ "sender = " + this.sender
			+ ", content = " + this.content
			+ "}";
	}
}
