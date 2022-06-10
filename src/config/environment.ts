import dotenv from "dotenv";

const result = dotenv.config({path: "./src/.env"});
if (process.env.NODE_ENV !== "production") {

    if(result.error) {
        throw result.error;
    }
}


export default result;