const socket = io();
let $sendButton = document.querySelector('.send');
let $inputMessage = document.querySelector('.inputMessage')
let $messageContainer = document.querySelector('.messageContainer')


socket.emit('set user', $sendButton.dataset['username']) 


socket.on('chatmessage', (message)=> {
  //console.log("from test message:", message);
  displayMessages(message);
});

//set message for typing
socket.on('telling typing', (data) => {
  document.querySelector('.typing').innerHTML = `${data.user} ${data.message}`;
  setTimeout(() => {
   document.querySelector('.typing').innerHTML = ``;
  }, 3000)
})

//listen for typing
$inputMessage.addEventListener('keyup',() => {
   socket.emit('typing', `is typing...`)
})

$sendButton.addEventListener('click', (e) => {
  let username = e.target.dataset['username']
  socket.emit('set user', username) 
  let userId = e.target.dataset['userid'];
  let partnerId = e.target.dataset['partnerid'];
  let inputMessage = document.querySelector('.inputMessage').value;
  let messageObj = {
    text: inputMessage,
    from: userId,
    to: partnerId
  }
  socket.emit('sendmessage', messageObj);
  $inputMessage.value = " ";
  document.querySelector('.typing').innerHTML = ``;
});

function displayMessages(data) {
  let html = `<div class='message'> <strong> ${data.user}</strong> : ${data.message} </div>`
  $messageContainer.innerHTML += html;
}

socket.on('testmessage', (message) => {
  console.log(message)
})