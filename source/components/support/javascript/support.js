import socketIO from 'socket.io-client';

export function requestSupport() {
  const socket = socketIO('http://localhost:3000');
  const supportButton = document.querySelector('[js-hook-module-support]');

  supportButton.addEventListener('click', () => {
    socket.emit('joinRoom', event.target.dataset.id);
  });
}

export function openChat() {
  const openChatButton = document.querySelector('[js-hook-module-chat]');
  const chatContainer = document.querySelector('[js-hook-support-chat]');

  openChatButton.addEventListener('click', () => {
    chatContainer.classList.remove('hide');
    const roomidContainer = chatContainer.querySelector('[type=hidden]');
    roomidContainer.value = openChatButton.dataset.id;
  });
}

export function sendChatMessage() {
  const chatForm = document.querySelector('[js-hook-module-chat-form]');
  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('send text message bro');
  });
  console.log(chatForm);
}
