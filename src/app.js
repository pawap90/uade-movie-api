'use strict';

require('dotenv').config();

const serverInit = require('./server-init');

serverInit.startServer()
    .then(app => {
        const port = process.env.CUSTOM_PORT || process.env.PORT;
        app.listen(port);

        console.log(`Listening on port ${port}`);
    })
    .catch((err) => console.log(err));