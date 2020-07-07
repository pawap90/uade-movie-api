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
 * Get member by id
 */
module.exports.getById = async (req, res, next) => {
    try {
        const member = await memberService.getById(req.params.id);

        return res.json(member);
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

/**
 * Update medical information of a member by id.
 */
module.exports.updateMedicalInfo = async (req, res, next) => {
    try {
        await memberService.updateMedicalInfo(req.params.id, req.body);

        return res.json({ message: 'success' });
    }
    catch (err) {
        return next(err);
    }
};

/**
 * Update member by id.
 */
module.exports.updateById = async (req, res, next) => {
    try {
        await memberService.updateById(req.params.id, req.body);

        return res.json({ message: 'success' });
    }
    catch (err) {
        return next(err);
    }
};