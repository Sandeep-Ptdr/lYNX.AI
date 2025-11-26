import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema({
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
    index: true,
  },
  role: { type: String, enum: ["user", "assistant", "system"], required: true },
  content: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed }, // e.g. { clientId, attachments, tokens }
  createdAt: { type: Date, default: Date.now, index: true },
});

MessageSchema.index({ conversationId: 1, createdAt: -1 });
export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
