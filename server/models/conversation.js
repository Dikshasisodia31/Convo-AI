import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    task: {
        type : String,
        required : true,
    },
    assignedTo: {
        type : String,
        default : "Unassigned",
    },
    deadline: {
        type: String,
        default : "No deadline",
    },
    status : {
        type : String,
        default : "pending",
    },
});

const analysisSchema = new mongoose.Schema({
    summary : {
        type : String,
        default: "",
    },

    tasks : {
        type : [taskSchema],
        default : [],
    },

    blockers : {
        type : [String],
        default: [],
    },

    decisions : {
        type: [String],
        default: [],
    },
});

const conversationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },

    analysis: {
      type: analysisSchema,
      default: () => ({}),
    },
    
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model(
  "Conversation",
  conversationSchema
);

export default Conversation;