import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISiteVisitor extends Document {
  _id: mongoose.Types.ObjectId;
  // SHA-256 hash of the visitor IP (+ salt). One document == one unique visitor.
  ipHash: string;
  // Total number of visits recorded for this visitor.
  visits: number;
  // Latest visit metadata, kept for the "recent visitors" list.
  path?: string;
  referrer?: string;
  userAgent?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteVisitorSchema = new Schema<ISiteVisitor>(
  {
    ipHash: { type: String, required: true, unique: true, index: true },
    visits: { type: Number, default: 1 },
    path: { type: String },
    referrer: { type: String },
    userAgent: { type: String },
    country: { type: String },
  },
  { timestamps: true },
);

// Recent-visitors queries sort by the most recent visit.
SiteVisitorSchema.index({ updatedAt: -1 });

const SiteVisitorModel: Model<ISiteVisitor> =
  mongoose.models.SiteVisitor ||
  mongoose.model<ISiteVisitor>("SiteVisitor", SiteVisitorSchema);

export default SiteVisitorModel;
