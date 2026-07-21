import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISiteVisitor extends Document {
  _id: mongoose.Types.ObjectId;
  // Salted hash of the client IP (or a client-supplied session id). Never the raw IP.
  ipHash: string;
  // Number of times this unique visitor has been recorded.
  visits: number;
  path?: string;
  referrer?: string;
  userAgent?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteVisitorSchema = new Schema<ISiteVisitor>(
  {
    ipHash: { type: String, required: true, unique: true },
    visits: { type: Number, default: 1 },
    path: { type: String },
    referrer: { type: String },
    userAgent: { type: String },
    country: { type: String },
  },
  { timestamps: true },
);

const SiteVisitorModel: Model<ISiteVisitor> =
  mongoose.models.SiteVisitor ||
  mongoose.model<ISiteVisitor>("SiteVisitor", SiteVisitorSchema);

export default SiteVisitorModel;
