const socket = io();

let $chatLink = document.querySelector('.chat-link')



$chatLink.addEventListener("click", (e) => {
  let username = e.target.dataset['username']
  console.log(e.target.dataset['username'])
  socket.emit('set user', username) 
})


