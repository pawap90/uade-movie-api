'use strict';

const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const app = express();

const swaggerSpec = require('./swagger-config');

module.exports.startServer = async () => {
    // Express.js configuration.
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Root endpoint.
    app.get('/', (req, res) => {
        res.status(200).json('Hello world');
    });

    // Setup all the application routes here.
    app.use('/api/account', require('./components/account/account.routes'));

    // Error handling middleware.
    app.use((err, req, res, next) => {

        let status = 500;
        let errRes = { message: 'Unexpected error' };

        if (err.statusCode) {
            status = err.statusCode;
            errRes.message = err.message;
        }

        if (process.env.ERRORS_DETAILED)
            errRes.error = err;

        res.status(status).json(errRes);
    });

    // Swagger documentation specification
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Database connection.
    await mongoose.connect(process.env.DB_CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.on('error', function (e) {
        throw e;
    });

    return app;
};