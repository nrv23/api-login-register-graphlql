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
const password_1 = __importDefault(require("../utils/password"));
const queryResolvers = {
    Query: {
        users: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            return (yield context.db
                .collection("users")
                .find()
                .toArray());
        }),
        login: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (!args.email || !args.password)
                    return {
                        message: "Datos de autenticación incorrectos",
                        status: false,
                    };
                const { email, password } = args;
                let userCheck = (yield context.db
                    .collection("users")
                    .findOne({ email }));
                console.log(userCheck);
                if (!userCheck)
                    return {
                        status: false,
                        message: "El usuario no existe",
                    };
                if (!(yield password_1.default.comparePass(args.password, userCheck.password)))
                    return {
                        message: "Datos de autenticación incorrectos",
                        status: false,
                    };
                delete userCheck.password;
                return {
                    status: true,
                    message: "",
                    user: userCheck,
                };
            }
            catch (error) {
                console.log({ error });
                return {
                    message: "Hubo un error en el servidor",
                    status: false,
                };
            }
        }),
    },
};
exports.default = queryResolvers;
