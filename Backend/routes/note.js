import { Router } from "express";
import { authorize, Roles } from "../middleware/auth.js";
import noteModel from "../model/noteSchema.js";
import membershipModel from "../model/membershipSchema.js";
import { Plans } from "../config.js";
import mongoose from "mongoose";
const router = Router();

//get all notes based on the tenant_id
router.get("/", authorize(Roles.All), (req, res) => {
    //fetch all notes with same tenant_id as user.
  noteModel
    .find({ tenant_id: req.user.tenant_id })
    .then((notes) => {
      res.status(200).json({message: "success", notes});
    })
    .catch((err) => {
      res.status(400).json({ message: "unable to fetch notes" });
    });
});

//add note based on tenant_id
router.post("/", authorize(Roles.All), async (req, res) => {
    //insert note into db
  const tenant_id = req.user.tenant_id;
  const result = await membershipModel.findOne({ tenant_id });
  //check mebership and no. of notes created before inserting 
  if (result.membership === Plans.free && result.notes_count >= 3) {
    res.status(403).json({
      code: 4031,
      error: "Notes limit reached",
      message: "Upgrade to Pro to create more notes",
    });
    return;
  }
  //create note 
  const newNote = new noteModel();
  newNote.tenant_id = req.user.tenant_id;
  newNote.title = req.body.title;
  newNote.content = req.body.content;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    //save and increment notes_count
    const note = await newNote.save({ session });
    await membershipModel.updateOne(
      { tenant_id },
      { $inc: { notes_count: 1 } },
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    res
      .status(201)
      .json({ ...note.toObject(), message: "Created Note Successfully" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "create note transaction failed." });
  }
});

router
  .route("/:id")
  //get single note using id
  .get(authorize(Roles.All), (req, res) => {
    const id = req.params.id;
    const tenant_id = req.user.tenant_id;
    if (!id) {
      res.status(403).json({ code: 4032, message: "bad request" });
      return;
    }
    noteModel
      .findById(id)
      .then((note) => {
        if (note.tenant_id !== tenant_id) {
          res.status(403).json({ code: 4033, message: "Access denied" });
        } else {
          res.status(200).json({ ...note.toObject() });
        }
      })
      .catch((err) =>
        res.status(400).json({
          message: `unable to fetch note by id : ${id}`,
          error: err.message,
        })
      );
  })
  //update note using id
  .put(authorize(Roles.All), async (req, res) => {
    const id = req.params.id;
    if (!id) {
      res.status(403).json({ code: 4032, message: "bad request" });
      return;
    }
    const title = req.body.title;
    const content = req.body.content;
    const tenant_id = req.user.tenant_id;

    try {
        //Find note 
      let note = await noteModel.findById(id);
      if (!note) {
        return res.status(404).json({ message: "No Note Found" });
      }
      //verify ownership of note
      if (note.tenant_id !== tenant_id) {
        return res.status(403).json({ code: 4033, message: "Access denied" });
      }
      //update note
      note = await noteModel.findByIdAndUpdate(
        id,
        { tenant_id, title, content },
        { new: true }
      );
      res
        .status(200)
        .json({ ...note.toObject(), message: "Updated successfully" });
    } catch (error) {
      res
        .status(400)
        .json({ message: `Unable to update note ${id}`, error: err.message });
    }
  })
  //Delete note using id
  .delete(authorize(Roles.All), async (req, res) => {
    const id = req.params.id;
    const tenant_id = req.user.tenant_id;
    if (!id) {
      res.status(403).json({ code: 4032, message: "bad request" });
      return;
    }
    

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      let note = await noteModel.findById(id);
      if (!note) {
        return res.status(404).json({ message: "No Note Found" });
      }
      //verify ownership of the note
      if (note.tenant_id !== tenant_id) {
        return res.status(403).json({ code: 4033, message: "Access denied" });
      }
      //delete note
      note = await noteModel.findByIdAndDelete(id, { session });
      if (!note) {
        return res.status(404).json({ message: "No Note Found" });
      }
      //decrement notes_count for the tenant
      await membershipModel.updateOne(
        { tenant_id },
        { $inc: { notes_count: -1 } },
        { session }
      );
      await session.commitTransaction();
      session.endSession();
      res
        .status(200)
        .json({ ...note.toObject(), message: "Deleted successfully" });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res
        .status(500)
        .json({ message: `Unable to delete note ${id}`, error: error.message });
    }
  });

export default router;
