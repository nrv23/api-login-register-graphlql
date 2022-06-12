import { Db } from "mongodb";
import { IUser } from "../../interface/IUser";
import { IResolvers } from "@graphql-tools/utils";
import utils from "../../utils/password";
import Jwt from "../../lib/jwt";

const jwt = new Jwt();
// arreglar el refactoring para separar los resolvers en carpetas y archivos para los diferentes tipos de resolvers hoy
const queryResolvers: IResolvers = {
  Query: {
    login: async (
      _: void,
      args: { email: string; password: string },
      context: { db: Db }
    ): Promise<{
      status: boolean;
      message: string;
      token?: string;
      elementSelect: string;
    }> => {
      try {
        // cada vez que un query o mutation lleve el async, debe retornar Promise<> y dentro la interfaz u objeto que va devolver
        // recordar que si una funcion lleva el async, por default devuelve una promesa

        if (!args.email || !args.password)
          return {
            message: "Datos de autenticación incorrectos",
            status: false,
            elementSelect: "user",
          };

        const { email, password } = args;

        const userCheck = (await context.db
          .collection("users")
          .findOne({ email })) as IUser;

        console.log(userCheck);

        if (!userCheck)
          return {
            status: false,
            message: "El usuario no existe",
            elementSelect: "token",
          };

        if (
          !(await utils.comparePass(
            args.password,
            userCheck.password as string
          ))
        )
          return {
            message: "Datos de autenticación incorrectos",
            status: false,
            elementSelect: "token",
          };

        delete userCheck.password;

        //generar el token aquí

        const token = jwt.sign({
          id: Number(userCheck.id),
          name: userCheck.nombre,
          lastName: userCheck.lastName,
          email: userCheck.email,
        });

        return {
          status: true,
          message: "Autenticado correctamente",
          token,
          elementSelect: "token",
        };
      } catch (error) {
        console.log({ error });

        return {
          message: "Hubo un error en el servidor",
          status: false,
          elementSelect: "token",
        };
      }
    },
  },
};

export default queryResolvers;
