import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProject extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  short_description: string;
  description: string;
  technologies: string[];
  github_url: string | null;
  live_url: string | null;
  image: string | null;
  featured: boolean;
  status: "completed" | "in-progress" | "archived";
  start_date: string | null;
  end_date: string | null;
  category: string | null;
  order_index: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    short_description: { type: String, required: true },
    description: { type: String, required: true },
    technologies: { type: [String], default: [] },
    github_url: { type: String, default: null },
    live_url: { type: String, default: null },
    image: { type: String, default: null },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["completed", "in-progress", "archived"],
      default: "completed",
    },
    start_date: { type: String, default: null },
    end_date: { type: String, default: null },
    category: { type: String, default: null },
    order_index: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
