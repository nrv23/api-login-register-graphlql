import { IToken } from "../interface/IToken";
import jwt from "jsonwebtoken";

export default class Jwt {
  private readonly secretKey: string =
    process.env.JWT_SECRET || "/()=?)(/!_[_HJFHGJTFHGJFHGJHNM*[Ñ_[*:";

  sign(data: IToken, expiresIn: number = 3600): string {
    // expiresIn en segundos

    return jwt.sign(
      data
    , this.secretKey, {
      expiresIn,
    });
  }

  decode(token: string): IToken {

    try {
      
      jwt.verify(token, this.secretKey); // si esto falla quiere decir que el token esta vencido o tiene un error

      return jwt.decode(token) as IToken;

    } catch (error) {
      
      console.log(error);
      throw new Error("Se ha vencido la sesión");
    }
  }
}
