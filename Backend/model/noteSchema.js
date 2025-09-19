import mongoose from "mongoose";
import { Schema } from "mongoose";

const noteSchema = new Schema({
    tenant_id: {type: String, required: true},
    title: {type: String, required: true},
    content: {type: String, required: true},
    createdAt: {type: Date, default:Date.now},
})

export default mongoose.model('notes', noteSchema);