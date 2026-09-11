import express from "express";

import { createConversation,analyzeConversationById } from "../controllers/conversationController.js";

const router = express.Router();

router.post("/",createConversation);
router.post("/:id/analyze",analyzeConversationById);

export default router;