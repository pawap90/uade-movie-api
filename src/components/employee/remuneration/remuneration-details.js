/**
 * Generate an array of remunerations details following the rules defined by the labor union.
 * @param {Object} employee Employee object
 */
module.exports.calculate = (employee) => {
    const details = [];

    // Gross salary
    details.push({
        description: 'Sueldo básico',
        value: employee.grossSalary
    });

    // Seniority
    const seniority = (new Date()).getFullYear() - employee.entryDate.getFullYear();
    if (seniority > 0)
        details.push({
            description: 'Antigüedad',
            value: employee.grossSalary * 0.02 * seniority
        });

    // Presenteeism
    // TO-DO Get from external service.

    // Extra hours
    // TO-DO Get from external service.

    const subtotal = this.sumSubtotals(details);

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
            description: 'Afiliación a UTEDYC,',
            value: subtotal * 0.025 * (-1)
        });

    // Holiday plus
    // TO-DO

    // Additional
    details.push({
        description: 'Monto no remunerativo',
        value: 5000
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
}