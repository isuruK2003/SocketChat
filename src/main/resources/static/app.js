var senderName = null;
var stompClient = null;
var messagesContainerElement = document.getElementById("messages");
var errorsContainerElement = document.getElementById("errors");
var senderNameInputElement = document.getElementById("sender-name");
var contentInputElement = document.getElementById("content");
var sendButtonElement = document.getElementById("send-button");
var connectButtonElement = document.getElementById("connect-button");
var avatarButtonlElement = document.getElementById("avatar-button");
var changeThemeButtonElement = document.getElementById("change-theme-button");
var themeStylesheetLinkElement = document.getElementById("theme-stylesheet");
var menuElement = document.getElementById("menu");

const DARK_THEME_STYLESHEET = "./styles/theme-dark.css";
const LIGHT_THEME_STYLESHEET = "./styles/theme-light.css";

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
    const maxColor = 11184810; // decimals
    const minColor =  5592405; // decimals
    const randomColor = Math.floor(
        (Math.random() * maxColor) + minColor
    ).toString(16); // hexadecimals
    avatarButtonlElement.style.backgroundColor = `#${randomColor}`;
}

function setAvatarSymbol() {
    avatarButtonlElement.innerHTML = senderName.charAt(0).toUpperCase();
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

function toggleTheme(newTheme) {
    if (newTheme === "dark") {
        themeStylesheetLinkElement.href = DARK_THEME_STYLESHEET;
    } else if (newTheme === "light") {
        themeStylesheetLinkElement.href = LIGHT_THEME_STYLESHEET;
    }
}

function toggleThemeToDeviceTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        toggleTheme("dark");
    } else {
        toggleTheme("light");
    }
}

function init(clearMessageContainer = true) {
    try {
        if (senderName !== null) {
            displayErrorMessage("Please join to a socket.")
            return;
        }
        readAndSetsenderName();
        setAvatarSymbol();
        setAvatarBackgroundColor();
        connect();
        if (clearMessageContainer) {
            messagesContainerElement.innerHTML = '';
        }
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

    changeThemeButtonElement.addEventListener("click", () => {
        const href = themeStylesheetLinkElement.href;
        if (href.includes("dark")) {
            toggleTheme("light")
        } else if (href.includes("light")) {
            toggleTheme("dark")
        }
    });

    avatarButtonlElement.addEventListener("click", () => {
        if (["none", ""].includes(menuElement.style.display)) {
            menuElement.style.display = "inline-block";
        } else {
            menuElement.style.display = "none";
        }
    });

    window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change',({ matches }) => {
            toggleThemeToDeviceTheme();
    });
}

document.addEventListener("DOMContentLoaded", main);