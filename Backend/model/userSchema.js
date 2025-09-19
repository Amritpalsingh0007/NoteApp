import mongoose from "mongoose";

const {Schema} = mongoose;

const userSchema = new Schema({
    tenant_id: {type: String, required: true},
    email_id: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: String
});


export default mongoose.model("users", userSchema);