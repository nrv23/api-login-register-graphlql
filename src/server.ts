import { IContext } from './interface/IContext';
import { ApolloServer } from "apollo-server-express";
import compression from "compression";
import express, { Application } from "express";
import { GraphQLSchema } from "graphql";
import { createServer, Server } from "http";
import Database from "./config/database";
import result from "./config/environment";

class GraphQLServer {
  // Propiedades
  private app!: Application;
  private httpServer!: Server;
  private readonly DEFAULT_PORT = process.env.PORT
    ? Number(process.env.PORT)
    : 6000;
  private schema!: GraphQLSchema;
  constructor(schema: GraphQLSchema) {
    if (schema === undefined) {
      throw new Error(
        "Necesitamos un schema de GraphQL para trabajar con APIs GraphQL"
      );
    }
    this.schema = schema;
    this.init();
  }

  private init() {
   

    this.initializeEnviroments();
    this.configExpress();
    this.configApolloServerExpress();
    this.configRoutes();
  }

  private initializeEnviroments(): void {
    if (process.env.NODE_ENV !== "production") { // si el ambiente no es produccion use las variables del archivo .env
      const envs = result;
      console.log(envs);
    }
  }

  private configExpress() {
    this.app = express();

    this.app.use(compression());

    this.httpServer = createServer(this.app);
  }

  private async configApolloServerExpress() {

     // llamar la funcion para iniciar la conexion con la bd 
     const database = new Database();

     const db = await database.init(); // retorna una promesa de la conexion a la bd
     //resuelve la promesa para devolver la instancia de la bd

     // obtener el token que se envía por la cabecera
 
     const context = async ({req,connection}: IContext)  => { // compartir la conexion de la bd con la api de graphql
      // obtener el token 

      // por el context recibe el token por las cabeceras, como si fuera una requeste http de tipo rest

      const token = req? req.headers.authorization : connection.authorization;

      console.log(token)
      
      return {
        db,
        token
      }
     };

    const apolloServer = new ApolloServer({
      schema: this.schema,
      introspection: true,
      context
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app: this.app, cors: true });
  }

  private configRoutes() {
    this.app.get("/hello", (_, res) => {
      res.send("Bienvenid@s al primer proyecto");
    });

    this.app.get("/", (_, res) => {
      res.redirect("/graphql");
    });
  }

  listen(callback: (port: number) => void): void {
    this.httpServer.listen(+this.DEFAULT_PORT, () => {
      callback(+this.DEFAULT_PORT);
    });
  }
}

export default GraphQLServer;
