"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const noteSchema = new mongoose_1.default.Schema({
    title: { type: "String", required: true },
    body: { type: "string", required: true },
    createdAt: { type: "Date", required: true },
    updatedAt: { type: "Date", required: true },
});
exports.Note = mongoose_1.default.model("Note", noteSchema);
