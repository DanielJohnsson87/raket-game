// Initialize everything when the window finishes loading
window.addEventListener('load', function (event) {
  var status = document.getElementById('status')
  var url = document.getElementById('url')
  var open = document.getElementById('open')
  var close = document.getElementById('close')
  var send = document.getElementById('send')
  var text = document.getElementById('text')
  var message = document.getElementById('message')
  var socket

  status.textContent = 'Not Connected'
  url.value = 'ws://localhost:1111?user_id=' + Math.round(Math.random(1, 10000) * 1000)
  close.disabled = true
  send.disabled = true

  // Create a new connection when the Connect button is clicked
  open.addEventListener('click', function (event) {
    open.disabled = true
    window.gameSocket = new WebSocket(url.value, 'echo-protocol')

    window.gameSocket.addEventListener('open', function (event) {
      close.disabled = false
      send.disabled = false
      status.textContent = 'Connected'
    })

    // Display messages received from the server
    window.gameSocket.addEventListener('message', function (event) {
      const message = JSON.parse(event.data)
      const is_terrain = message.type && message.type === 'terrain'
      const is_position = message.type && message.type === 'position'
      console.log(message)
      if (is_terrain) {
        window.Raket.Terrain.setTerrain(message.message)
      }

      if (is_position) {
        window.Raket.BuddyPos = JSON.parse(message)
      }

      message.textContent = 'Server Says: ' + event.data

    })

    // Display any errors that occur
    window.gameSocket.addEventListener('error', function (event) {
      message.textContent = 'Error: ' + event
    })

    window.gameSocket.addEventListener('close', function (event) {
      open.disabled = false
      status.textContent = 'Not Connected'
    })
  })

  // Close the connection when the Disconnect button is clicked
  close.addEventListener('click', function (event) {
    close.disabled = true
    send.disabled = true
    message.textContent = ''
    window.gameSocket.close()
  })

  // Send text to the server when the Send button is clicked
  send.addEventListener('click', function (event) {
    window.gameSocket.send(text.value)
    text.value = ''
  })
})
