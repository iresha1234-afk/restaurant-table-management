import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import tableRoutes from "./routes/tableRoutes.js";



dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/tables", tableRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("DB Connected"))
.catch(err => console.log(err));

app.listen(process.env.PORT, () =>
  console.log("Server running on port " + process.env.PORT)
);
