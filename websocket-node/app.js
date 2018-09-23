#!/usr/bin/env node
var WebSocketServer = require('websocket').server
var http = require('http')
var exec = require('child_process').exec
var terrain = require('./parts/Terrain')

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

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true
}

function IsJsonString(str) {
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
        rejectConnection(request)
        return
    }

    var connection = acceptConnection(request)
    var clientID = getClientID(request)
    clients[clientID] = connection
    sendTerrain()

    connection.on('message', handleMessage(clientID))
    connection.on('close', handleConnectionClose)
})

/**
 *
 */
function sendTerrain() {
    const payload = JSON.stringify({
        type: 'terrain',
        message: terrain
    });
    sendToAll(payload)
}


/**
 *
 * @param request
 * @returns {*}
 */
function rejectConnection(request) {
    request.reject()
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.')
    return request
}

/**
 *
 * @param request
 * @returns {*}
 */
function acceptConnection(request) {
    console.log((new Date()) + ' Connection accepted')
    return request.accept('echo-protocol', request.origin)
}

/**
 *
 * @param request
 * @returns {*}
 */
function getClientID(request) {
    return request.resourceURL.query.user_id
}

/**
 *
 * @param reasonCode
 * @param description
 */
function handleConnectionClose(reasonCode, description) {
    // console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.')
    console.log((new Date()) + ' Peer disconnected.')
    //Todo: Remove item from client's array
}


/**
 *
 * @param message
 */
function handleMessage(userID) {
    console.log('userid', userID)
    return function (message) {
        console.log('message', message)
        if (message.type === 'utf8') {
            console.log('SEND')
            sendToAllExcept(message.utf8Data, userID)
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes')
            // connection.sendBytes(message.binaryData)
        }
    }
}


/**
 *
 * @param message
 * @param ignoreUserID
 */
function sendToAllExcept(message, ignoreUserID) {
    clients.forEach(function (client, index) {
        console.log(ignoreUserID, index, ignoreUserID != index)
        if (ignoreUserID != index) {
            client.sendUTF(message)
        }
    })
}

function sendToAll(message) {
    clients.forEach(function (client, index) {
        client.sendUTF(message)
    })
}
