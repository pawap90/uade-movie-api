'use strict';

const error = require('throw.js');
const MemberModel = require('./member.model');

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
            entryDate: member.entryDate
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