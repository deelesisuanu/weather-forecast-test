const STATUS_CODES = {
    "OK": 200
};

const buildResponse = (data) => {
    delete data.updatedAt;
    delete data.createdAt;
    if (data.status) delete data.status;
    return data;
};

module.exports = {
    STATUS_CODES,
    buildResponse,
};