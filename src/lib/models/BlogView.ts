import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBlogView extends Document {
  _id: mongoose.Types.ObjectId;
  slug: string;
  ipHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogViewSchema = new Schema<IBlogView>(
  {
    slug: { type: String, required: true, index: true },
    ipHash: { type: String, required: true },
  },
  { timestamps: true },
);

BlogViewSchema.index({ slug: 1, ipHash: 1 }, { unique: true });

const BlogViewModel: Model<IBlogView> =
  mongoose.models.BlogView ||
  mongoose.model<IBlogView>("BlogView", BlogViewSchema);

export default BlogViewModel;
