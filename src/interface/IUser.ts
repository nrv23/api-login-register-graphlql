import { WithId } from "mongodb";

export interface IUser extends WithId<Document> {
    // extender la interfaz con WithId<Document> para poder tipar las respuestas de mongodb
    id?: string
    nombre: string;
    lastName: string;
    password?: string;
    email: string;
    registerDate?: string;
}