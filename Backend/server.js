import { PORT } from './config.js';
import db from "./db/initdb.js";
import express from 'express';
import authRoutes from './routes/auth.js';
import noteRoutes from './routes/note.js';
import membershipRoutes from './routes/membership.js'
import cors from 'cors';

const app = express();

//cors config
app.use(cors());

// Parses the text as url encoded data
app.use(express.urlencoded({ extended: true }));

// Parses the text as json
app.use(express.json());

//Routes
app.use("/auth/v1/", authRoutes);
app.use("/notes", noteRoutes);
app.use('', membershipRoutes);

app.get('/health',(req, res)=>{
    res.status(200).json({status:"ok"})
});

app.listen(PORT || 3000, ()=>
console.log(`server started at port ${PORT || 3000}`));