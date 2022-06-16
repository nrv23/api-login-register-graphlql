import { Db } from "mongodb";
import { IUser } from "./../../../interface/IUser";
import { IResolvers } from "@graphql-tools/utils";
import utils from "./../../../utils/password";
import Jwt from "./../../../lib/jwt";

const jwt = new Jwt();

const mutationResolvers: IResolvers = {
  Mutation: {
    update: async (
      _: void,
      args: { user: IUser },
      context: { db: Db; token: string }
    ): Promise<{
      status: boolean;
      message: string;
      elementSelect:string;
      user?: IUser;
    }> => {

      console.log({context})
      console.log(args);
      try {
        if (!args.user.id) {
          return {
            status: false,
            message: "El campo id es requerido",
            elementSelect: "user"
          };
        }

        //verificar token

        const userDecode = jwt.decode(context.token);

        console.log({ userDecode });

        const exists = (await context.db
          .collection("users")
          .findOne({ id: args.user.id })) as IUser;

        console.log({ exists });

        if (!exists) {
          return {
            status: false,
            message: "El usuario no existe",
            elementSelect: "user"
          };
        }

        if (Number(exists.id) !== Number(args.user.id)) {
          return {
            status: false,
            message: "Usuario inválido",
            elementSelect: "user"
          };
        }

        if (args.user.password) {
          const hasPass = await utils.getPassword(args.user.password as string);

          console.log({ hasPass });

          args.user.password = hasPass;
        }

        const updated = await context.db.collection("users").updateOne(
          { id: args.user.id },
          {
            $set: {
              nombre: args.user.nombre,
              lastName: args.user.lastName,
              email: args.user.email,
              password: !args.user.password
                ? exists.password
                : args.user.password,
            },
          }
        );

        console.log({ updated });

        if (!updated || updated.matchedCount === 0) {
          return {
            status: false,
            message: "No se pudo actualizar el usuario",
            elementSelect: "user"
          };
        }

        delete exists.password;

        return {
          status: true,
          message: "Actualizado correctamente",
          user: exists,
          elementSelect: "user"
        };
      } catch (error) {
        console.log({ error });

        return {
          status: true,
          message: "Hubo un error al actualizar el usuario",
          elementSelect: "user"
        };
      }
    },
  },
};

export default mutationResolvers;
