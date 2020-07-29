'use strict';

const fetch = require('node-fetch');
const error = require('throw.js');

const logger = require('./external-service-logger');

const SERVICE_NAME = 'CREDITEX';

const endpoints = {
    GET_CLIENT_BY_DNI: `${process.env.CREDITEX_URL}/clients/dni/{dni}`,
    CREATE_TRANSACTION: `${process.env.CREDITEX_URL}/transactions`,
    GET_CARDS: `${process.env.CREDITEX_URL}/cards/{clientId}/active`
};

/**
 * Get creditex client by DNI
 * @param {String} dni Client's DNI
 */
module.exports.getClient = async (dni) => {
    const endpoint = endpoints.GET_CLIENT_BY_DNI.replace('{dni}', dni);
    try {
        const res = await fetch(endpoint);

        if (res.status === 404)
            throw new error.NotFound('Creditex - Client not found');

        await logger.logResponse(SERVICE_NAME, 'GET', res, { dni });

        const client = await res.json();

        return client;
    }
    catch (err) {
        await logger.logError(SERVICE_NAME, 'GET', endpoint, { dni }, err);
        if (!err.statusCode)
            throw new error.InternalServerError('Creditex - Error getting client by DNI');
        throw err;
    }
};

/**
 * Create transaction
 * @param {String} clientId Client identifier
 * @param {Object} card Card data
 * @param {Number} amount Transaction amount
 */
module.exports.createTransaction = async (card, amount) => {
    const endpoint = endpoints.CREATE_TRANSACTION;
    const method = 'POST';

    const body = {
        cvv: card.cvv,
        merchantId: process.env.CREDITEXT_MERCHANT_ID,
        cardNumber: card.number,
        expiryDate: card.expiryDate,
        amount: amount
    };

    try {
        const res = await fetch(endpoint, {
            method: method,
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });

        await logger.logResponse(SERVICE_NAME, method, res, body);

        const result = await res.json();

        return result;
    }
    catch (err) {
        await logger.logError(SERVICE_NAME, method, endpoint, body, err);
        throw new error.InternalServerError('Creditex - Error creating transaction for client');
    }
};

/**
 * Get creditex client cards
 * @param {String} clientId Client's identifier
 */
module.exports.getClientCards = async (clientId) => {
    const endpoint = endpoints.GET_CARDS.replace('{clientId}', clientId);
    try {
        const res = await fetch(endpoint);

        await logger.logResponse(SERVICE_NAME, 'GET', res, { clientId });

        const cards = await res.json();

        return cards;
    }
    catch (err) {
        await logger.logError(SERVICE_NAME, 'GET', endpoint, { clientId }, err);
        if (!err.statusCode)
            throw new error.InternalServerError('Creditex - Error getting cards');
        throw err;
    }
};