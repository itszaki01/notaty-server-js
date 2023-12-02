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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const Database_1 = require("./Database");
const mongoose_1 = require("mongoose");
const stripe_1 = __importDefault(require("stripe"));
const errorHandler_1 = __importStar(require("./helpers/errorHandler"));
const stripe = new stripe_1.default(process.env.VITE_STRIPE_SK);
const app = (0, express_1.default)();
//MiddleWares
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
//GetAllNotes API
app.get("/notes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.query.title) {
            const data = yield Database_1.db.getAllNotes({ title: RegExp(req.query.title, 'ig') });
            console.log(req.query);
            res.send(data);
        }
        else {
            const data = yield Database_1.db.getAllNotes();
            res.send(data);
        }
    }
    catch (error) {
        (0, errorHandler_1.default)(error);
    }
}));
//GetNoteByID API
app.get("/notes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const data = yield Database_1.db.getNoteByID(id);
        if (!data)
            throw new mongoose_1.Error(`ObjectId failed`);
        res.send(data);
    }
    catch (error) {
        (0, errorHandler_1.idErrorHanlder)(error, id, res);
    }
}));
//CreateNewPost API
app.post("/notes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = yield Database_1.db.addNote(req.body);
        res.send(doc);
    }
    catch (error) {
        (0, errorHandler_1.default)(error);
    }
}));
//UpdatePostById API
app.put("/notes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Database_1.db.updateNote(req.body);
        if (!data)
            throw new mongoose_1.Error(`ObjectId failed`);
        res.send(data);
    }
    catch (error) {
        (0, errorHandler_1.idErrorHanlder)(error, req.body._id, res);
    }
}));
app.delete("/notes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Database_1.db.deleteNote(req.params.id);
        if (!data)
            throw new mongoose_1.Error(`ObjectId failed`);
        res.send(data);
    }
    catch (error) {
        (0, errorHandler_1.idErrorHanlder)(error, req.params.id, res);
    }
}));
app.post("/create-payment-intent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { items, shipping, description } = req.body;
    const calculationOrderAmount = (items) => {
        let amount = 0;
        for (const item of items) {
            amount += item.price * item.quantity;
        }
        amount *= 100;
        return amount;
    };
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: calculationOrderAmount(items),
        currency: "usd",
        payment_method_types: ["card"],
        description,
        shipping: {
            address: {
                line1: shipping.line1,
                city: shipping.city,
                country: shipping.country,
                postal_code: shipping.postal_code,
            },
            name: shipping.name,
            phone: shipping.phone,
        },
    });
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
}));
const PORT = process.env.PORT || np;
app.listen(PORT, () => {
    console.log("server is Running in port ", PORT);
    Database_1.db.connect();
});
