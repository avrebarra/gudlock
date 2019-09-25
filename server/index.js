const net = require('net')
const locks = require('./utils/locks')

const socketServer = net.createServer()

socketServer.on('connection', (socket) => {
  socket.on('data', (data) => {
    // valid message format is case-sensitive texts splitted with '#' char.
    // First part will be the command name, second part will be the params (lock key name)
    // Example: LOCK#NEW_REQUEST_REGISTER or RELEASE#NEW_REQUEST_REGISTER:PASS_PHRASE
    const [command, params] = data.toString().trim().split('#')

    var lockName, passphrase, response

    switch (command.toUpperCase()) {
      case 'LOCK':
        lockName = params
        response = locks.acquireLock(lockName) + '\n'

        socket.write(response)
        socket.end()
        break

      case 'RELEASE':
        [lockName, passphrase] = params.split(':')
        response = locks.releaseLock(lockName, passphrase) + '\n'

        socket.write(response)
        socket.end()
        break
    }
  })
})

module.exports = socketServer
