const net = require('net')
const locks = require('./utils/locks')

const socketServer = net.createServer()

const formatLockName = (lockName) => lockName.replace(' ', '_')

socketServer.on('connection', (socket) => {
  socket.on('data', (data) => {
    // valid message format is case-sensitive texts splitted with '#' char.
    // First part will be the command name, second part will be the params (lock key name)
    // Example: LOCK#NEW_REQUEST_REGISTER or RELEASE#NEW_REQUEST_REGISTER:PASS_PHRASE
    const [command, params] = data.toString().trim().split('#')
    console.log(command, params)

    var lockName, passphrase

    switch (command.toUpperCase()) {
      case 'LOCK':
        lockName = params
        socket.write(locks.acquireLock(formatLockName(lockName)) + '\n')
        break

      case 'RELEASE':
        [lockName, passphrase] = params.split(':')
        socket.write(locks.releaseLock(formatLockName(lockName), passphrase) + '\n')
        break
    }
  })
})

module.exports = socketServer
