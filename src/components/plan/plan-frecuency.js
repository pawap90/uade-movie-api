const frecuencyDictionary = {
    daily: 'daily',
    weekly: 'weekly',
    biweekly: 'biweekly', // Twice a month (every 2 weeks)
    monthly: 'monthly',
    biannual: 'biannual', // Twice a year (every 6 months)
    yearly: 'yearly'
}

/**
 * Constant options for plan frecuency.
 */
module.exports.options = [
    frecuencyDictionary.daily,
    frecuencyDictionary.weekly,
    frecuencyDictionary.biweekly, // Twice a month (every 2 weeks)
    frecuencyDictionary.monthly,
    frecuencyDictionary.biannual, // Twice a year (every 6 months)
    frecuencyDictionary.yearly
];

/**
 * Calculate the next expiration date given a frecuency and a base date.
 * @param {String} frecuency Frecuency value
 * @param {Date} date Base date
 */
module.exports.calculateExpiration = (frecuency, date) => {
    if (!frecuencyDictionary[frecuency])
        throw new Error('Invalid frecuency');

    let expirationDate = new Date(date.getTime());

    switch (frecuency) {
        case frecuencyDictionary.daily:
            expirationDate.setDate(date.getDate() + 1);
            break;
        case frecuencyDictionary.weekly:
            expirationDate.setDate(date.getDate() + 7);
            break;
        case frecuencyDictionary.biweekly:
            expirationDate.setDate(date.getDate() + 14);
            break;
        case frecuencyDictionary.monthly:
            expirationDate.setMonth(date.getMonth() + 1);
            break;
        case frecuencyDictionary.biannual:
            expirationDate.setMonth(date.getMonth() + 6);
            break;
        case frecuencyDictionary.yearly:
            expirationDate.setFullYear(date.getFullYear() + 1);
            break;
    }

    return expirationDate;
}