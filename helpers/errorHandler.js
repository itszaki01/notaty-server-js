"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idErrorHanlder = void 0;
const mongoose_1 = require("mongoose");
function errorHandler(error) {
    const _error = error;
    throw new mongoose_1.Error(_error.message);
}
exports.default = errorHandler;
function idErrorHanlder(error, id, res) {
    const _error = error;
    if (_error.message.includes("ObjectId failed")) {
        res.status(404).send({ error: `Note with id ${id} not found` });
    }
    else {
        res.status(500).send({ error: _error.message });
    }
}
exports.idErrorHanlder = idErrorHanlder;
