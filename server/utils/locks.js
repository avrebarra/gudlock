const lockRegistry = {}

const acquireLock = (lockname) => {
  if (lockRegistry[lockname]) return 'FAIL'

  // generate lock passphrase from timestamp and register
  const lock = (+new Date()).toString(36)
  lockRegistry[lockname] = lock

  return `OK#${lock}`
}

const releaseLock = (lockname, passphrase) => {
  if (!lockRegistry[lockname]) return 'OK#NO_CHANGE'
  if (lockRegistry[lockname] && lockRegistry[lockname] !== passphrase) return 'FAIL'

  lockRegistry[lockname] = null

  return 'OK'
}

module.exports = { acquireLock, releaseLock }
