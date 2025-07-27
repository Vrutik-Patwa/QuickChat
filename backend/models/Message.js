import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    test: { type: String },
    image: { type: String },
    seen: { Boolean: false, default: false },
    
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
