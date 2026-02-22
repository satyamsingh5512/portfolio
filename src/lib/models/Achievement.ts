import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAchievement extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  issuer: string;
  date: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    date: { type: String, required: true },
    file: { type: String, required: true },
  },
  { timestamps: true },
);

const Achievement: Model<IAchievement> =
  mongoose.models.Achievement ||
  mongoose.model<IAchievement>("Achievement", AchievementSchema);

export default Achievement;
