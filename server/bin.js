const server = require("./index")
const signale = require('signale')

const DEFAULT_HOST = '127.0.0.1'
const DEFAULT_PORT = 6969

server.listen(DEFAULT_PORT, DEFAULT_HOST)

signale.success(`Connected to ${DEFAULT_HOST}:${DEFAULT_PORT}`)