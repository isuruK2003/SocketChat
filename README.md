# SocketChat

## Overview

**SocketChat** is a WebSocket-based chat application built to demonstrate WebSockets support in **Spring Boot**. The application allows real-time communication between clients, making it ideal for scenarios that require instant messaging, like chatrooms. The frontend is built using **vanilla JavaScript**, while the backend is powered by **Spring Boot** (Java). Currently, the app supports basic chat functionalities, and work is underway to implement **multi-room support**.

## Features

- Real-time messaging between users using WebSockets.
- **Vanilla JavaScript** frontend for a lightweight and fast user experience.
- **Spring Boot** backend with WebSocket integration for seamless communication.
- Easy-to-use interface to send and receive messages in real-time.

## Technologies Used

- **Backend**:
  - **Spring Boot** for building the backend service.
  - **WebSocket** for real-time, full-duplex communication between clients and the server.
  
- **Frontend**:
  - **Vanilla JavaScript** for handling client-side operations.
  - **HTML/CSS** for the user interface.
  
## Current Features

- **Basic Chat Functionality**: Send and receive messages in real-time.
- **Single Room Chat**: Initial version supports a single chat room for all users.

## Work in Progress

- **Multi-Room Support**: Currently working on enabling multiple chat rooms, where users can join different rooms based on topics or interests.
- **User Authentication**: Future enhancements include adding user authentication to allow private messaging and secure access to rooms.

## Installation

### Prerequisites

- Java 8 or higher
- Maven
- Node.js (for frontend development)

### Backend Setup

1. Clone the repository:
   
   ```bash
   git clone https://github.com/yourusername/socketchat.git
   cd socketchat
   ```
2. Navigate to the backend directory and build the project with Maven:

  ```bash
  cd backend
  mvn clean install
  ```

3. Run the Spring Boot application:

  ```bash
  mvn spring-boot:run
  The backend should now be running at http://localhost:8080.
  ```

### Usage
After the backend has setup, go to `http://localhost:8080`. You can open this another tab or window and see how it works.

## Conclusion
SocketChat is a simple, real-time WebSocket-based chat application that highlights the power of Spring Boot and WebSocket integration. This app served me a great starting point for learning about real-time communication and how it can be implemented in a full-stack application.
