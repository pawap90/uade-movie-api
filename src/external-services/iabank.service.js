'use strict';

const fetch = require('node-fetch');
const error = require('throw.js');

const logger = require('./external-service-logger');

const SERVICE_NAME = 'IABANK';

const endpoints = {
    GET_CLIENT_BY_DNI: `${process.env.IABANK_URL}/clients/person/{dni}`,
    GET_CLIENT_ACCOUNTS: `${process.env.IABANK_URL}/clients/{clientId}/accounts`,
    CREATE_TRANSFER: `${process.env.IABANK_URL}/movements/transfer`
};

/**
 * Get IaBank client by DNI
 * @param {String} dni Client's DNI
 */
module.exports.getClient = async (dni) => {
    const endpoint = endpoints.GET_CLIENT_BY_DNI.replace('{dni}', dni);
    try {
        const res = await fetch(endpoint);

        if (res.status === 404)
            throw new error.NotFound('IaBank - Client not found');

        if (!res.ok)
            throw new error.CustomError('IaBank error', `Error getting client ${JSON.stringify(await res.json())}`, res.status);

        await logger.logResponse(SERVICE_NAME, 'GET', res, { dni });

        const client = await res.json();

        return client;
    }
    catch (err) {
        await logger.logError(SERVICE_NAME, 'GET', endpoint, { dni }, err);
        if (!err.statusCode)
            throw new error.InternalServerError('IaBank - Error getting client by DNI');
        throw err;
    }
};

/**
 * Get IaBank client accounts
 * @param {String} clientId Client's identifier
 */
module.exports.getClientSavingsAccount = async (clientId) => {
    const endpoint = endpoints.GET_CLIENT_ACCOUNTS.replace('{clientId}', clientId);
    try {
        const res = await fetch(endpoint);

        if (!res.ok)
            throw new error.CustomError('IaBank error', `Error getting accounts ${JSON.stringify(await res.json())}`, res.status);

        await logger.logResponse(SERVICE_NAME, 'GET', res, { clientId });

        const accounts = await res.json();

        if (accounts != null && accounts.length > 0) {
            const savingsAccount = accounts.find(a => {
                return a.account_type === 'SavingBank';
            });

            if (!savingsAccount)
                throw new error.NotFound('IaBank - Savings account not found');

            return savingsAccount;
        }

        throw new error.NotFound('IaBank - Savings account not found');
    }
    catch (err) {
        await logger.logError(SERVICE_NAME, 'GET', endpoint, { clientId }, err);
        if (!err.statusCode)
            throw new error.InternalServerError('IaBank - Error getting accounts');
        throw err;
    }
};

/**
 * Create transfer
 * @param {Number} destinationAccountId Client account identifier
 * @param {Number} amount Transfer amount
 * @param {String} description Transfer description
 */
module.exports.createTransfer = async (destinationAccountId, amount, description) => {
    const endpoint = endpoints.CREATE_TRANSFER;
    const method = 'POST';

    const params = {
        accountId: process.env.IABANK_MERCHANT_ACCOUNT,
        amount: amount,
        description: description,
        destinationAccount: destinationAccountId
    };

    try {
        var formBody = [];
        for (var property in params) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(params[property]);
            formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');

        const res = await fetch(endpoint, {
            method: method,
            body: formBody,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (!res.ok)
            throw new error.CustomError('IaBank error', `Error creating transfer ${JSON.stringify(await res.json())}`, res.status);

        await logger.logResponse(SERVICE_NAME, method, res, params);

        const result = await res.json();

        return result;
    }
    catch (err) {
        await logger.logError(SERVICE_NAME, method, endpoint, params, err);
        throw new error.InternalServerError('IaBank - Error creating transfer for client');
    }
};