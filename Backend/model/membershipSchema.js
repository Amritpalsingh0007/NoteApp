import mongoose from "mongoose";
import { Schema } from "mongoose";

const membershipSchema = new Schema({
  tenant_id: { type: String, required: true, unique: true },
  membership: { type: String, enum: ["free", "pro"], default: "free"},
  notes_count: {type: Number, required: true, default: 0 }

});

export default mongoose.model('memberships', membershipSchema);