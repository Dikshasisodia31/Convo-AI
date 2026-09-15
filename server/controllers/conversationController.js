import Conversation from "../models/conversation.js";
import {analyzeConversation, analyzeAudio} from "../services/geminiService.js"

export const createConversation = async(req,res) => {
    try{
        const {content} = req.body;

        if(!content || content.trim() === ""){
            return res.status(400).json({
                success : false,
                message : "Conversation content is mandatory to fill",
            })
        }
        const newConversation = await Conversation.create({
            content,
        });

        res.status(201).json({
            success : true,
            message : "Conversation saved successfully",
            data: newConversation,
        })
    }catch(err){
        console.log("error",err);

        res.status(500).json({
            success : false,
            message : "Something went wrong",
            error : err.message,
        });
    }
};

export const analyzeConversationById = async(req,res) => {
    try{
        const conversation = await Conversation.findById(req.params.id);

        if(!conversation){
            return res.status(404).json({
                success : false,
                message : "Conversation is not found",
            });
        }

        const analysis = await analyzeConversation(
            conversation.content
        );
        
        conversation.analysis = analysis;

        await conversation.save();

        res.status(200).json({
            success : true,
            message : "Analyze done carefully",
            data : conversation,
        });

    }catch(err){
        console.log("AI analysis error");
        res.status(500).json({
            success : false,
            message : "Failed to analyze conversation",
            error: err.message,
        });
    }
};

export const analyzeAudioConversation = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Audio file is required"
            });
        }

        console.log("Audio received:", req.file.originalname);

        const analysis = await analyzeAudio(
            req.file.path,
            req.file.mimetype
        );

        // Save conversation in MongoDB
        const newConversation = await Conversation.create({
            content: `Audio meeting: ${req.file.originalname}`,
            analysis
        });

        // Delete temporary audio file
        fs.unlinkSync(req.file.path);

        res.status(201).json({
            success: true,
            message: "Audio analyzed successfully",
            data: newConversation
        });

    } catch (err) {

        console.error("Audio analysis error:", err);

        // Clean up file if something failed
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            message: "Failed to analyze audio",
            error: err.message
        });
    }
};

