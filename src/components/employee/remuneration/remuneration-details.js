const moment = require('moment');

/**
 * Generate an array of remunerations details following the rules defined by the labor union.
 * @param {Object} employee Employee object
 */
module.exports.calculate = (employee, remunerationDate) => {
    const details = [];

    // Gross salary
    details.push({
        description: 'Sueldo básico',
        value: employee.grossSalary
    });

    // Seniority
    const seniority = Math.floor(Math.abs(remunerationDate - employee.entryDate) / (1000 * 60 * 60 * 24 * 365));
    details.push({
        description: 'Antigüedad',
        value: employee.grossSalary * 0.02 * seniority
    });

    // Presenteeism
    // TO-DO Get from external service.

    // Extra hours
    // TO-DO Get from external service.

    const subtotal = this.sumSubtotals(details);

    // Holiday plus
    const a = moment(employee.vacationStartDate, 'DD/MM/YYYY');
    const b = moment(employee.vacationEndDate, 'DD/MM/YYYY');
    const vacationDays = b.diff(a, 'days');

    details.push({
        description: 'Vacation',
        value: (employee.grossSalary / 25) * vacationDays
    });

    // Additional
    details.push({
        description: 'Monto no remunerativo',
        value: 5000
    });

    // Deductions

    // UTEDYC - Labor union
    details.push({
        description: 'UTEDYC',
        value: subtotal * 0.02 * (-1)
    });

    // Retirement
    details.push({
        description: 'Jubilación',
        value: subtotal * 0.11 * (-1)
    });

    // PAMI
    details.push({
        description: 'Ley 19.032 - INSSJP (PAMI)',
        value: subtotal * 0.03 * (-1)
    });

    // Social security
    details.push({
        description: 'Obra Social',
        value: subtotal * 0.03 * (-1)
    });

    // UTEDYC - Labor union affiliation
    if (employee.isUnionMember)
        details.push({
            description: 'Afiliación a UTEDYC',
            value: subtotal * 0.025 * (-1)
        });


    return details;
};

/**
 * Sum all items' values in the details array.
 * @param {Array} details Details object array
 */
module.exports.sumSubtotals = (details) => {
    const total = details.reduce((acc, det) => {
        return det.value + acc;
    }, 0);

    return total;
};

/**
 * Combine two arrays of details.
 * @param {Array} details Original details
 * @param {Array} newDetails New details
 */
module.exports.combine = (details, newDetails) => {
    // Replace values.
    for (const key in details) {
        const item = details[key];

        const newItem = newDetails.find((auxItem) => auxItem.description === item.description);
        if (newItem) {
            item.value = newItem.value;
        }
    }

    // Add new values
    for (const key in newDetails) {
        const newItem = newDetails[key];

        const itemExist = details.find((auxItem) => auxItem.description === newItem.description);
        if (!itemExist) {
            details.push(newItem);
        }
    }

    return details;
};