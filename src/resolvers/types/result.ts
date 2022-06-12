import { IResolvers } from "@graphql-tools/utils";

const typeResolvers: IResolvers = {
  Result: {
    // esto se va llamar igual a la interfaz de salida
    __resolveType(root: { elementSelect: string }) {
      // el root lee la respuesta del query
      // con este type se evalua cual de las interfaces va devolver datos, de forma que se pueda evaluar dinamicamente
      // con varias interfaces a la misma vez
      // el parámetro eelementSelect va en la respuesta de la api e indica en su valor cual va ser la interfaz que va devolver los datos

      if (root.elementSelect === "user") {
        return "ResultUser";
      }

      if (root.elementSelect === "token") {
        return "ResultToken";
      }
    },
  },
};

export default typeResolvers;
