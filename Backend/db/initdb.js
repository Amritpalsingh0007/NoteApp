import mongoose from "mongoose";
import { MONGO_URI } from "../config.js";

const connection = await mongoose.connect(MONGO_URI);
console.log("Connecte to Mongodb");
export default connection;
