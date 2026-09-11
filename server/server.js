import "dotenv/config";

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import conversationRoutes from "./routes/conversationRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("we are good to go");
});

app.use("/api/conversations", conversationRoutes);

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
    console.log(`SERVER STARTED ON PORT ${PORT}`);
});

connectDB();