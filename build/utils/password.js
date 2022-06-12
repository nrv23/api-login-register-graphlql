"use strict";
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
const bcrypt_1 = __importDefault(require("bcrypt"));
function getSalt(saltRound) {
    return new Promise((resolve, reject) => {
        bcrypt_1.default.genSalt(saltRound, (err, salt) => {
            if (err)
                return reject(err);
            return resolve(salt);
        });
    });
}
function hashPassword(password, salt) {
    return new Promise((resolve, reject) => {
        bcrypt_1.default.hash(password, salt, function (err, hash) {
            if (err)
                return reject(err);
            return resolve(hash);
        });
    });
}
function getPassword(myPlaintextPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const saltRounds = 10;
            const salt = yield getSalt(saltRounds);
            const password = yield hashPassword(myPlaintextPassword, salt);
            return password;
        }
        catch (error) {
            throw error;
        }
    });
}
function comparePass(pass, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            bcrypt_1.default.compare(pass, hash, (err, result) => {
                if (err)
                    return reject(err);
                return resolve(result);
            });
        });
    });
}
exports.default = {
    getPassword,
    comparePass,
};
