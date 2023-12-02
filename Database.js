"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const note_1 = require("./schemas/note");
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = __importDefault(require("./helpers/errorHandler"));
dotenv_1.default.config();
class Database {
    constructor() {
        this.Url = `${process.env.MONGOO_DB}`;
    }
    //Connect To DB
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose_1.default.connect(this.Url);
                console.log("Database connected");
            }
            catch (error) {
                (0, errorHandler_1.default)(error);
            }
        });
    }
    // Create New Note
    addNote(note) {
        return __awaiter(this, void 0, void 0, function* () {
            const newNoteSchema = Object.assign(Object.assign({}, note), { createdAt: new Date(), updatedAt: new Date() });
            try {
                const newNote = new note_1.Note(newNoteSchema);
                const doc = yield newNote.save();
                return doc;
            }
            catch (error) {
                (0, errorHandler_1.default)(error);
            }
        });
    }
    //GetAllNotes
    // 
    getAllNotes(findObject = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield note_1.Note.find(findObject);
                return data;
            }
            catch (error) {
                (0, errorHandler_1.default)(error);
            }
        });
    }
    //GetNoteByID
    getNoteByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield note_1.Note.findById(id);
                return data;
            }
            catch (error) {
                (0, errorHandler_1.default)(error);
            }
        });
    }
    //UpdateNote
    updateNote(updatedNote) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUpdatedNote = {
                title: updatedNote.title,
                body: updatedNote.body,
                updatedAt: new Date(),
            };
            try {
                const data = yield note_1.Note.findByIdAndUpdate(updatedNote._id, newUpdatedNote);
                return data;
            }
            catch (error) {
                (0, errorHandler_1.default)(error);
            }
        });
    }
    //UpdateNote
    deleteNote(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield note_1.Note.findByIdAndDelete(id);
                if (!data)
                    throw new mongoose_1.Error(`ObjectId failed`);
                return data;
            }
            catch (error) {
                (0, errorHandler_1.default)(error);
            }
        });
    }
}
exports.db = new Database();
