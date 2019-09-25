const net = require('net')
const defaults = require('../defaults')

const MAX_LOCK_ACQUIRING_RETRIES = 20
const RETRY_DELAYS_MULTIPLIER = 10

const _wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms))

const _communicate = (payload) => {
  const client = new net.Socket()

  return new Promise((resolve, reject) => {
    client.connect(defaults.DEFAULT_PORT, defaults.DEFAULT_HOST, () => {
      client.on('data', (data) => { client.destroy(); resolve(data.toString().trim()) })

      // Send payload to server
      client.write(payload)
    })
  })
}

const _makeReleaseFunc = (lockName, passphrase) => {
  return async () => {
    const response = await _communicate(`RELEASE#${lockName}:${passphrase}`)
    const [status] = response.split('#')

    if (status !== 'OK') { throw new Error('Unable to release lock!') }
  }
}

const lock = async (lockName = defaults.DEFAULT_LOCK_NAME) => {
  var retryCount = 0

  while (true) {
    const response = await _communicate(`LOCK#${lockName}`)
    const [status, params] = response.split('#')

    if (status === 'OK') { return _makeReleaseFunc(lockName, params) }

    if (retryCount < MAX_LOCK_ACQUIRING_RETRIES) {
      await _wait(retryCount * RETRY_DELAYS_MULTIPLIER)
    } else {
      throw new Error('Unable to acquire lock!')
    }
  }
}

module.exports = { lock }
