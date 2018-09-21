#!/usr/bin/env node
var WebSocketServer = require('websocket').server
var http = require('http')
var exec = require('child_process').exec

var server = http.createServer(function (request, response) {
  console.log((new Date()) + ' Received request for ' + request.url)
  response.writeHead(404)
  response.end()
})
server.listen(1111, function () {
  console.log((new Date()) + ' Server is listening on port 1111')
})

wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false
})

function originIsAllowed (origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true
}

function IsJsonString (str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

var clients = []

wsServer.on('request', function (request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject()
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.')
    return
  }
  var connection = request.accept('echo-protocol', request.origin)
  console.log((new Date()) + ' Connection accepted.')
  // console.log(request)
  // console.log('id', request.resourceURL.query.user_id)
  var userID = request.resourceURL.query.user_id

  // clients.push(connection)
  clients[userID] = {
    connection,
    userID
  }

  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data)

      sendToAllExcept(message.utf8Data, connection)

      // clients.forEach((client) => {
      //   console.log('client', client)
      //   client.sendUTF(message.utf8Data)
      // })

      // let test = exec(message.utf8Data, {maxBuffer: 1000*1024}),
      //     jsonString = '';
      // test.stdout.setEncoding('utf8');
      //
      // test.stdout.on('data', function (chunk) {
      //     jsonString += chunk;
      // });
      //
      // test.stdout.on('close', function(bla) {
      //     console.log('close', jsonString, bla);
      //     if(IsJsonString(jsonString)) {
      //         console.log('Send!');
      //         connection.sendUTF(jsonString);
      //     } else {
      //         console.log('else')
      //       connection.sendUTF(jsonString);
      //         // console.log('------\n');
      //         // console.log('nope',jsonString.length);
      //         // console.log('------\n');
      //     }
      // });

      // test.stdout.on('end', function() {
      //     console.log('end');
      // });

    }
    else if (message.type === 'binary') {
      console.log('Received Binary Message of ' + message.binaryData.length + ' bytes')
      connection.sendBytes(message.binaryData)
    }
  })
  connection.on('close', function (reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.')
  })
})

function sendToAllExcept (message, dontSendTo) {


  for (var j = 0; j < clients.length; j++) {

    clients[j].sendUTF(message)
    // if (dontSendToID !== currentID) {
    // }
  }
}
