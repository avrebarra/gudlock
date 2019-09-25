const server = require('./index')
const defaults = require('../defaults')

const DEFAULT_HOST = defaults.DEFAULT_HOST
const DEFAULT_PORT = defaults.DEFAULT_PORT

server.listen(DEFAULT_PORT, DEFAULT_HOST)

console.log(`Serving on ${DEFAULT_HOST}:${DEFAULT_PORT}`)
