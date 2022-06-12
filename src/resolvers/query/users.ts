import { IToken } from "../../interface/IToken";
import { Db } from "mongodb";
import { IUser } from "../../interface/IUser";
import { IResolvers } from "@graphql-tools/utils";
import utils from "../../utils/password";
import Jwt from "../../lib/jwt";

const jwt = new Jwt();
// arreglar el refactoring para separar los resolvers en carpetas y archivos para los diferentes tipos de resolvers hoy
const queryResolvers: IResolvers = {
  Query: {
    users: async (
      _: void,
      __: unknown, // no recibe parametros por lo que se pone como tipo indefinido
      context: { db: Db }
    ): Promise<Array<IUser>> => {
      // se pone unknown porque no va recibir parametros

      return (await context.db
        .collection("users")
        .find()
        .toArray()) as Array<IUser>;
    },
  },
};

export default queryResolvers;
