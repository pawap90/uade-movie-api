'use strict';

const memberService = require('./member.service');

/**
 * Get all members
 */
module.exports.getAll = async (req, res, next) => {
    try {
        const members = await memberService.getAll();

        return res.json(members);
    }
    catch (err) {
        return next(err);
    }
};

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