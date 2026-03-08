import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPortfolioView extends Document {
  _id: mongoose.Types.ObjectId;
  contentType: "blog" | "project";
  slug: string;
  ipHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioViewSchema = new Schema<IPortfolioView>(
  {
    contentType: {
      type: String,
      enum: ["blog", "project"],
      required: true,
      index: true,
    },
    slug: { type: String, required: true, index: true },
    ipHash: { type: String, required: true },
  },
  { timestamps: true },
);

// A single visitor session counts once per content item across the whole portfolio
PortfolioViewSchema.index(
  { contentType: 1, slug: 1, ipHash: 1 },
  { unique: true },
);

const PortfolioViewModel: Model<IPortfolioView> =
  mongoose.models.PortfolioView ||
  mongoose.model<IPortfolioView>("PortfolioView", PortfolioViewSchema);

export default PortfolioViewModel;
