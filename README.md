# node-chat
A simple chat application built with node.js, express, socket.io, and redis.

## Requirements
* [node.js](http://nodejs.org/download/)
* [npm](https://github.com/npm/npm)
* [redis](http://redis.io/topics/quickstart)

## Install
Clone the repo and install dependencies:
```bash
$ git clone https://github.com/mhosinski/node-chat.git
$ cd node-chat
$ npm install
```

## Run
Start redis server:
```bash
$ redis-server
```

Start app:
```bash
$ node app.js
```

Navigate to [http://localhost:3000](http://localhost:3000) to test. Simulate additional users by opening the app in multiple tabs.

## License
[MIT](https://github.com/mhosinski/node-chat/blob/master/LICENSE.md)
