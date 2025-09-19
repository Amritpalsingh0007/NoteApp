import { Router } from "express";
import { authorize, Roles } from "../middleware/auth.js";
import membershipModel from "../model/membershipSchema.js";
import { Plans } from "../config.js";
import mongoose from "mongoose";
import noteModel from "../model/noteSchema.js";

const router = Router();

// This maps to BASE_URL/reset
// Resets tenant memberships to free, resets notes_count to 0,
// and removes all notes of tenant
router.post("/", authorize(Roles.Admin), async (req, res) => {
    const tenant_id = req.user.tenant_id;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const membershipResult = await membershipModel.updateMany(
      {tenant_id},
      { membership: Plans.free, notes_count: 0 },
      { session }
    );

    const notesResult = await noteModel.deleteMany({tenant_id}, { session });

    await session.commitTransaction();

    return res.status(200).json({
      message: "Reset Successful",
      membershipsUpdated: membershipResult.modifiedCount,
      notesDeleted: notesResult.deletedCount,
    });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    return res.status(500).json({ message: "Unable to reset" });
  } finally {
    await session.endSession();
  }
});

export default router;
