import mongoose, { Document, Model, Schema } from "mongoose";

export interface IExperience extends Document {
  _id: mongoose.Types.ObjectId;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string | null;
  description: string[];
  technologies: string[];
  is_current: boolean;
  company_url?: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    company: { type: String, required: true },
    position: { type: String, required: true },
    location: { type: String, required: true },
    start_date: { type: String, required: true },
    end_date: { type: String, default: null },
    description: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    is_current: { type: Boolean, default: false },
    company_url: { type: String },
    logo: { type: String },
  },
  { timestamps: true },
);

const Experience: Model<IExperience> =
  mongoose.models.Experience ||
  mongoose.model<IExperience>("Experience", ExperienceSchema);

export default Experience;
