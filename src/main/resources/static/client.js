var senderName = null;
var stompClient = null;
var messagesContainerElement = document.getElementById("messages");
var errorsContainerElement = document.getElementById("errors");
var senderNameInputElement = document.getElementById("sender-name");
var contentInputElement = document.getElementById("content");
var sendButtonElement = document.getElementById("send-button");
var connectButtonElement = document.getElementById("connect-button");
var avatarSymbolElement = document.getElementById("avatar-symbol");

function readMessage() {
    let content = contentInputElement.value.trim();
    if (content === "") {
        throw "Empty Content";
    }
    return JSON.stringify({
        'sender': senderName,
        'content': content
    });
}

function clearMessage() {
    contentInputElement.value = "";
}

function readAndSetsenderName() {
    let senderNameInput = senderNameInputElement.value.trim();
    if (senderNameInput === "") {
        displayErrorMessage("Name cannot be empty");
        senderNameInputElement.focus();
        throw "Empty Sender Name";
    } else {
        senderName = senderNameInput;
    }
}

function setAvatarBackgroundColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    avatarSymbolElement.style.backgroundColor = `#${randomColor}`;
}

function setAvatarSymbol() {
    avatarSymbolElement.innerHTML = senderName.charAt(0).toUpperCase();
}

function autoScroll(scrollAnyway = false) {
    const scrolledAmount = messagesContainerElement.scrollHeight
        - (messagesContainerElement.scrollTop + messagesContainerElement.clientHeight);

    const isNearBottom = scrolledAmount < 200;

    if (isNearBottom || scrollAnyway) {
        messagesContainerElement.scrollTop = messagesContainerElement.scrollHeight;
    }
}

function displayMessage(messageObj) {
    let messageClass = messageObj.sender === senderName ? 'this-user' : '';
    messagesContainerElement.innerHTML +=
        `<div class="message ${messageClass}">
            <span class="sender">${messageObj.sender}</span>
            <span class="content">${messageObj.content}</span>
        </div>`;
    autoScroll(senderName === messageObj.sender);
}

function displayErrorMessage(errorMessage) {
    let errorId = `error-${Date.now()}`; // generates unique error id
    messagesContainerElement.innerHTML +=
        `<div class="error" id="${errorId}" onclick="closeDisplayedErrorMessage('${errorId}')">
             <span>${errorMessage}</span>
             <button class="button-close">
                 &#10005;
             </button>
         </div>`;
    autoScroll(true)
}

function connect() {
    let socket = new SockJS("/chat");
    stompClient = Stomp.over(socket);
    stompClient.connect(
        {},
        (frame) => {
            console.log(frame);
            subscribeToMessages();
        }
    );
}

function subscribeToMessages() {
    stompClient.subscribe(
        "/topic/messages",
        (response) => {
            displayMessage(JSON.parse(response.body));
        }
    );
}

function closeDisplayedErrorMessage(errorId) {
    document.getElementById(errorId).remove();
}

function sendMessage() {
    try {
        if (stompClient === null) {
            displayErrorMessage("Please enter your name and connect");
            return;
        }
        stompClient.send('/app/sendMessage', {}, readMessage());
        clearMessage();
    } catch (error) {
        displayErrorMessage(error);
    }
}

function init() {
    try {
        if (senderName !== null) {
            return;
        }
        readAndSetsenderName();
        setAvatarSymbol();
        setAvatarBackgroundColor();
        connect();
    } catch (error) {
        console.log(error);
    }
}

function main() {
    sendButtonElement.addEventListener("click", sendMessage);

    connectButtonElement.addEventListener("click", init);

    senderNameInputElement.addEventListener("keypress", (event) => {
        if (event.key === "Enter") init();
    });

    contentInputElement.addEventListener("keypress", (event) => {
        if (event.key === "Enter") sendMessage();
    });
}

document.addEventListener("DOMContentLoaded", main);
