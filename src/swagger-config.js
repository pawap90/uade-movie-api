'use strict';

const swaggerJSDoc = require('swagger-jsdoc');

// Swagger definition
const swaggerDefinition = {
    info: {
        title: 'UADE Movie App REST API', // Title of the documentation
        version: '1.0.0', // Version of the app
        description: 'REST API documentation for UADE Movie App' // short description of the app
    },
    basePath: '/api' // the basepath of your endpoint
};

// options for the swagger docs
const options = {
    // import swaggerDefinitions
    swaggerDefinition,
    // path to the API docs
    apis: ['./documentation/**/*.yaml']
};
// initialize swagger-jsdoc
module.exports = swaggerJSDoc(options);