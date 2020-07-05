'use strict';

const memberService = require('./member.service');

/**
 * Create member.
 */
module.exports.create = async (req, res, next) => {
    try {
        await memberService.create(req.body);

        return res.json({ message: 'success' });
    }
    catch (err) {
        return next(err);
    }
};