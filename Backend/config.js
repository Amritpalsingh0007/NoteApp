import path from 'path'
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.SERVER_PORT;
const SECRET_TOKEN= process.env.SECRET_TOKEN;
const MONGO_URI = process.env.MONGO_URI;

//Plans constant is for representing the membership plans
const Plans = {
    free: "free",
    pro: "pro"
}
export {PORT, SECRET_TOKEN, MONGO_URI, Plans};