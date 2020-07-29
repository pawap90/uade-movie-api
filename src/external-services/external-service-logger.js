
module.exports.logResponse = async (serviceName, method, res, params) => {
    const auxRes = res.clone();
    const result = await auxRes.json();
    logRes(serviceName, method || 'GET', auxRes.url, params, auxRes.status, auxRes.statusText, result);
}

module.exports.logError = (serviceName, method, url, params, err) => {
    logRes(serviceName, method, url, params, err.statusCode, err.name, err);
}

const logRes = (serviceName, method, endpoint, params, status, statusText, result) => {
    console.log(`${serviceName}-----------------------------`);
    console.log(`Method: ${method}`);
    console.log(`Endpoint: ${endpoint}`);

    if (params) {
        console.log(`Params:`);
        console.log(params);
    }

    if (result) {
        console.log(`Response:`);
        console.log(result);
    }

    console.log(`Status: ${status} ${statusText}`);
    console.log(`-----------------------------`);
}