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
const mutationResolvers = {
    Mutation: {
        add: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const userCheck = yield context.db
                    .collection("users")
                    .findOne({ email: args.user.email.trim() });
                if (userCheck) {
                    console.log("La cuenta de correo ya existe");
                    return {
                        status: false,
                        message: "La cuenta de correo ya existe",
                    };
                }
                if (!args.user.password) {
                    console.log("No viene un password válido");
                    return {
                        status: false,
                        message: "Password inválido",
                    };
                }
                const lastElement = yield context.db
                    .collection("users")
                    .find()
                    .limit(1)
                    .sort({ registerDate: -1 })
                    .toArray();
                args.user.id =
                    lastElement.length === 0
                        ? "1"
                        : String(Number(lastElement[0].id) + 1);
                args.user.registerDate = new Date().toISOString();
                const hasPass = yield password_1.default.getPassword(args.user.password);
                console.log({ hasPass });
                args.user.password = hasPass;
                const nuevoUsuario = yield context.db
                    .collection("users")
                    .insertOne(args.user);
                if (!nuevoUsuario.insertedId) {
                    console.log("No se insertó el usuario");
                    return {
                        status: false,
                        message: "No se pudo agregar el usuario",
                    };
                }
                console.log("Se añadió correctamente");
                delete args.user.password;
                return {
                    status: true,
                    message: "Se agregó correctamente",
                    user: args.user,
                };
            }
            catch (error) {
                console.log({ error });
                return {
                    status: false,
                    message: "Hubo un error al agregar el usuario",
                };
            }
        }),
    },
};
exports.default = mutationResolvers;
