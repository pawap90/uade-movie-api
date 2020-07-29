'use strict';

const error = require('throw.js');

const MemberModel = require('./member.model');

const creditexService = require('../../external-services/creditex.service');

/**
 * Get all members
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.getAll = async () => {
    try {
        const members = await MemberModel.find().select('memberNumber dni persona.name persona.lastName persona.email emergencyPhoneNumber');

        return members;
    }
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error getting all members');
        else throw err;
    }
};

/**
 * Get member by Id
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.getById = async (memberId) => {
    try {
        return await MemberModel.findById(memberId)
            .populate('plan');
    }
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error getting member');
        else throw err;
    }
};

/**
 * Creates a new member
 * @param {Object} member Member data
 * @throws {BadRequest} When the member data is invalid or not provided
 * @throws {Conflict} When the email already exists in the db
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.create = async (member) => {
    try {
        if (!member)
            throw new error.BadRequest('member data not provided');

        member.email = member.email ? member.email.toLowerCase() : null;

        // Create an MemberModel instance to allow mongoose to validate the model.
        let newMember = new MemberModel();
        newMember = {
            memberNumber: await generateMemberNumber(),
            dni: member.dni,
            emergencyPhoneNumber: member.emergencyPhoneNumber,
            entryDate: member.entryDate,
            cuit: member.cuit
        };
        newMember.persona = {
            name: member.name,
            lastName: member.lastName,
            email: member.email,
            address: member.address,
            dateOfBirth: member.dateOfBirth
        };

        await MemberModel.create(newMember);
    }
    catch (err) {
        if (err.name === 'MongoError' && err.code === 11000)
            throw new error.Conflict('Member with the specified email already registered.');
        else if (err.name === 'ValidationError')
            throw new error.BadRequest('Invalid member data.');
        else throw err;
    }
};

/**
 * Find a member by their id and update their medical information.
 * Creates the medical information object if needed.
 * @param {String} id Member identifier
 * @param {Object} medicalInfo Member's updated medical information
 */
module.exports.updateMedicalInfo = async (id, medicalInfo) => {
    try {
        if (!medicalInfo)
            throw new error.BadRequest('Medical information not provided');

        await MemberModel.findByIdAndUpdate(id, {
            $set: {
                medicalInformation: {
                    certificateIssuedDate: medicalInfo.certificateIssuedDate,
                    certificateIssuerMedicalLicense: medicalInfo.certificateIssuerMedicalLicense,
                    observations: medicalInfo.observations,
                    hasHeartProblems: medicalInfo.hasHeartProblems,
                    hasAsthma: medicalInfo.hasAsthma,
                    hasDiabetes: medicalInfo.hasDiabetes,
                    smokes: medicalInfo.smokes
                }
            }
        }, { runValidators: true });
    }
    catch (err) {
        if (err.name === 'ValidationError')
            throw new error.BadRequest('Invalid medical information.');
        else throw err;
    }
};

/**
 * Generate a secuential number for a new member based on the previously generated number.
 * E.g: M-000001
 */
const generateMemberNumber = async () => {
    let number = 1;
    const lastMember = await MemberModel.findOne().sort({ createDate: -1 });

    if (lastMember) {
        const lastNumber = parseInt(lastMember.memberNumber.split('-')[1].replace('0', ''));
        number = lastNumber + 1;
    }

    const numberString = number.toString();
    const memberNumber = 'M-' + numberString.padStart(7 - numberString.length, '0');

    return memberNumber;
};

/**
 * Update member by id.
 * @param {String} id Member identifier
 * @param {Object} member Member data
 * @throws {BadRequest} When the member data is invalid or not provided
 * @throws {Conflict} When the email already exists in the db
 * @throws {InternalServerError} When there's an unexpected error.
 */
module.exports.updateById = async (id, member) => {
    try {
        if (!member)
            throw new error.BadRequest('member data not provided');

        member.email = member.email ? member.email.toLowerCase() : null;

        await MemberModel.findByIdAndUpdate(id, {
            $set: {
                emergencyPhoneNumber: member.emergencyPhoneNumber,
                dni: member.dni,
                cuit: member.cuit,
                persona: {
                    name: member.name,
                    lastName: member.lastName,
                    email: member.email,
                    address: member.address,
                    dateOfBirth: member.dateOfBirth
                }
            }
        }, { runValidators: true });
    }
    catch (err) {
        if (err.name === 'MongoError' && err.code === 11000)
            throw new error.Conflict('Member with the specified email already registered.');
        else if (err.name === 'ValidationError')
            throw new error.BadRequest('Invalid member data.');
        else if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error updating member');
        else throw err;
    }
};

/**
* Delete member by Id
* @throws {InternalServerError} When there's an unexpected error.
*/
module.exports.deleteById = async (memberId) => {
    try {
        return await MemberModel.findByIdAndDelete(memberId);
    }
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error deleting member');
        else throw err;
    }
};

/**
 * Find a member by their id and update their assigned plan.
 * Creates the plan object if needed.
 * @param {String} id Member identifier
 * @param {Object} plan Member's new plan
 */
module.exports.updatePlan = async (id, plan) => {
    try {
        if (!plan)
            throw new error.BadRequest('Plan not provided');

        await MemberModel.findByIdAndUpdate(id, {
            $set: {
                plan: plan.planId
            }
        }, { runValidators: true });
    }
    catch (err) {
        if (err.name === 'ValidationError')
            throw new error.BadRequest('Invalid plan.');
        throw err;
    }
};

/**
 * Get member cards
 * @param {String} memberId Member identifier
 */
module.exports.getMemberCards = async (memberId) => {
    try {
        const member = await this.getById(memberId);

        const client = await creditexService.getClient(member.dni);

        const cards = await creditexService.getClientCards(client.id);

        return cards;
    }
    catch (err) {
        if (!err.statusCode)
            throw new error.InternalServerError('Unexpected error getting member cards');
        else throw err;
    }
};