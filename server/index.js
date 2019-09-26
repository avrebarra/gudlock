const net = require('net')
const locks = require('./utils/locks')
const defaults = require('../defaults')

const DEFAULT_HOST = defaults.DEFAULT_HOST
const DEFAULT_PORT = defaults.DEFAULT_PORT

const _tcpserver = net
  .createServer()
  .on('connection', (socket) => {
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

// Start tcp-lock server
const start = ({ port = DEFAULT_PORT, host = DEFAULT_HOST } = {}) => {
  return _tcpserver.listen(port, host)
}

module.exports = { start }
