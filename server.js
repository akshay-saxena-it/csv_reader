"use strict";
require('dotenv').config();
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const process = require('process');
const cors = require('cors');
const router = require('./routers/index');
const bodyParser = require('body-parser');
const socketjs = require('./helper/socket')

const app = express()
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const APIVersion = process.env.API_VERSION || 'v1';

app.use(cors());

//parse application/x-ww-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
//parse application/json
app.use(bodyParser.json());

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (err) => {
    console.log('Not able to connect to the database.', err)
    process.exit(1);
}
);
db.once('open', function () {
    console.log('we are connected')
});

app.use(`/api/${APIVersion}`, router);

socketjs.socket(io);

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})