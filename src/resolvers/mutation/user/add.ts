import { Db } from "mongodb";
import { IUser } from "./../../../interface/IUser";
import { IResolvers } from "@graphql-tools/utils";
import utils from "./../../../utils/password";
import Jwt from "./../../../lib/jwt";

const jwt = new Jwt();

const mutationResolvers: IResolvers = {
  Mutation: {
    add: async (
      _: void,
      args: { user: IUser },
      context: { db: Db }
    ): Promise<{
      status: boolean;
      message: string;
      user?: IUser;
      elementSelect: string;
    }> => {
      try {
        // comprobar que el usuario existe

        const userCheck = await context.db
          .collection("users")
          .findOne({ email: args.user.email.trim() });

        if (userCheck) {
          console.log("La cuenta de correo ya existe");

          return {
            status: false,
            message: "La cuenta de correo ya existe",
            elementSelect: "user"
          };
        }

        if (!args.user.password) {
          console.log("No viene un password válido");

          return {
            status: false,
            message: "Password inválido",
            elementSelect: "user"
          };
        }

        const lastElement = await context.db
          .collection("users")
          .find()
          .limit(1)
          .sort({ registerDate: -1 })
          .toArray();
        // ordenado de forma descendente por fecha de refistro

        args.user.id =
          lastElement.length === 0
            ? "1"
            : String(Number(lastElement[0].id) + 1);
        args.user.registerDate = new Date().toISOString();

        const hasPass = await utils.getPassword(args.user.password);

        console.log({ hasPass });

        args.user.password = hasPass;

        const nuevoUsuario = await context.db
          .collection("users")
          .insertOne(args.user);

        if (!nuevoUsuario.insertedId) {
          console.log("No se insertó el usuario");

          return {
            status: false,
            message: "No se pudo agregar el usuario",
            elementSelect: "user"
          };
        }

        console.log("Se añadió correctamente");

        delete args.user.password; // borrar la propiedad del password

        return {
          status: true,
          message: "Se agregó correctamente",
          user: args.user,
          elementSelect: "user"
        };
      } catch (error) {
        console.log({ error });

        return {
          status: false,
          message: "Hubo un error al agregar el usuario",
          //user: nuevoUsuario
          elementSelect: "user"
        };
      }
    },
  },
};

export default mutationResolvers;
