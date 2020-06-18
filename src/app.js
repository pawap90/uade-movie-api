'use strict';

require('dotenv').config();

const serverInit = require('./server-init');

serverInit.startServer()
    .then(app => {
        app.listen(process.env.port);
    })
    .catch((err) => console.log(err));