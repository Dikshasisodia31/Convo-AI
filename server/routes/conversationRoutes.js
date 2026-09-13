import express from "express";
import multer from "multer";

import { createConversation,analyzeConversationById,analyzeAudioConversation } from "../controllers/conversationController.js";

const router = express.Router();

const upload = multer({
    dest : "uploads/"
});

router.post("/",createConversation);
router.post("/audio/analyze", upload.single(audio),analyzeAudioConversation);
router.post("/:id/analyze",analyzeConversationById);

export default router;