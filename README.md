<div class="info">
  <h1 class="name" align="center">tcp-lock</h1>
</div>


## Summary
Add centralised lock support in NodeJS. Basically, a lock that just works, it's using TCP communication underneath.

This made to tackles:
- I can't f$%W! (frankly) use Redis
- Race condition in concurrent running async tasks
- Wild access to a resource from multiple node processes
- Yeah those kind of things

## Installation

Install `tcp-lock` using the [npm](https://www.npmjs.com/) package manager:

```sh
$ npm install tcp-lock
```

## User Guide

After setting up [how lock-server is run](https://github.com/shrotavre/tcp-lock#setting-up-lock-server), to use locks is as simple as these:

```js
import { client as tcplock } from 'tcp-lock'

// acquire lock
const release = await tcplock.lock()

console.log('important processing is running...')

// release the lock
await release()
```

Its also possible to give the locks name, so its possible to have >1 lock active in the same time, example:
```js
// specify lock name/identifier on acquire. 
// to release the lock, no need to specify lock's name

const release = await tcplock.lock('LOCK_NAME_HERE')

console.log('important processing is running...')

await release()
```

### Setting up Lock-Server

This will add package called `tcp-lock` in your project. There are two options on using this package depending on where you want to run the locks-server:
1. Run server inside a node app
2. Run server as separate node app

#### 1. Running server in node app

This method will attach server to process & runtime of another node app (parent app).

***PROS:** Generally lighter resources consumption. **CONS:** Lock service will dies when parent node go down.*

**How to use this method:**

```js
// basically include and start listening in node-app's entry point

import { server } from 'tcp-lock'

server.listen(8827, '127.0.0.1')

console.log(`Lock server running on 127.0.0.1:8827`)
```

#### 2. Running server as separate node process

This method will start server as individual process & runtime.

***PROS:** Lock service wont depend on any other node app's state. **CONS:** Generally bigger resources consumption.* 

**How to use this method:**

```bash
# run this command 
$ node node_modules/eslint/bin/server

# this will start a new process in
# default port and ip (127.0.0.1:6969)
```

## Contributing

Documentation is an OPEN Open Source Project. This means that:

Individuals making significant and valuable contributions are given
commit-access to the project to contribute as they see fit.