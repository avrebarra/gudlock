const net = require('net')
const defaults = require('../defaults')

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

    console.log(status)

    if (status !== 'OK') { throw new Error('Unable to release lock!') }
  }
}

const lock = async (lockName = defaults.DEFAULT_LOCK_NAME) => {
  const response = await _communicate(`LOCK#${lockName}`)
  const [status, params] = response.split('#')

  if (status !== 'OK') { throw new Error('Unable to acquire lock!') }

  return _makeReleaseFunc(lockName, params)
}

module.exports = { lock }
