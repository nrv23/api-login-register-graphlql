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
    me: async (
      _: void,
      __: unknown, // no recibe parametros por lo que se pone como tipo indefinido
      context: { db: Db; token: string }
    ): Promise<{
      status: boolean;
      message: string;
      elementSelect: string;
      user?: IUser;
    }> => {
      try {
        const userDecode = jwt.decode(context.token);

        console.log({ userDecode });
        const { email } = userDecode;

        const user = (await context.db
          .collection("users")
          .findOne({ email })) as IUser;

        if (!user) {
          return {
            status: false,
            message: "Usuario no encontrado",
            elementSelect: "user",
          };
        }

        delete user?.password;

        console.log({ user });

        return {
          status: true,
          message: "Usuario encontrado",
          user,
          elementSelect: "user",
        };
      } catch (error) {
        console.log(error);

        return {
          status: false,
          message: "Error al buscar la información del usuario",
          elementSelect: "user",
        };
      }
    },
  },
};

export default queryResolvers;
