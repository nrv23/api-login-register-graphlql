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
const chalk_1 = __importDefault(require("chalk"));
const mongodb_1 = require("mongodb");
class Database {
    init() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log("========================== DATABASE ==========================");
            try {
                const mongoDbUrl = `${process.env.DB_URL}${process.env.DB_NAME}`;
                const mongoCliente = yield mongodb_1.MongoClient.connect(mongoDbUrl);
                this.db = mongoCliente.db();
                console.log(`STATUS: ${chalk_1.default.green("ONLINE")}`);
                console.log(`DATABASE: ${chalk_1.default.green(this.db.databaseName)}`);
            }
            catch (error) {
                console.log(`ERROR: ${error}`);
                console.log(`STATUS: ${chalk_1.default.blue("OFFLINE")}`);
                console.log(`DATABASE: ${chalk_1.default.blue((_a = this.db) === null || _a === void 0 ? void 0 : _a.databaseName)}`);
            }
            return this.db;
        });
    }
}
exports.default = Database;
