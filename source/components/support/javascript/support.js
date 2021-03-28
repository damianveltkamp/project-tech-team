let socket = io();

function createMesageElement(message, nodeClass) {
    const node = document.createElement('div');
    const textNode = document.createTextNode(message);
    node.classList.add('support__message');
    node.classList.add(nodeClass);
    node.appendChild(textNode);

    return node;
}

export function requestSupport() {
    const supportButton = document.querySelector('[js-hook-module-support]');
    supportButton.addEventListener('click', () => {
        socket.emit('joinRoom', event.target.dataset.id);
    });
}

export function openChat() {
    const openChatButton = document.querySelectorAll('[js-hook-module-chat]');
    const chatContainer = document.querySelector('[js-hook-support-chat]');

    [...openChatButton].forEach((node) => {
        node.addEventListener('click', () => {
            chatContainer.classList.remove('hide');
            const roomidContainer = chatContainer.querySelector('[type=hidden]');
            roomidContainer.value = node.dataset.id;
            socket.emit('joinRoom', node.dataset.id);
        });
    });
}

export function sendChatMessage() {
    const chatForm = document.querySelector('[js-hook-module-chat-form]');
    chatForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const roomID = document.querySelector('[js-hook-roomid]').value;
        const date = new Date();
        const timeString = date.getHours() + ":" + date.getMinutes() + " ";


        const message = timeString + document.querySelector('[js-hook-chat-message]').value;
        const messageContainer = document.querySelector(
            '[js-hook-module-get-messages]',
        );

        socket.emit('message', { message, roomID });
        const messageElement = createMesageElement(message, 'sender');
        messageContainer.insertBefore(messageElement, messageContainer.firstChild);
    });
}

export function getChatMessages() {
    // TODO append html to ontvnager
    socket.on('send-message', (message) => {
        const messageContainer = document.querySelector(
            '[js-hook-module-get-messages]',
        );

        const messageElement = createMesageElement(message, 'receiver');
        messageContainer.insertBefore(messageElement, messageContainer.firstChild);
    });
}