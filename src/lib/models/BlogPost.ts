import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBlogPost extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  // TipTap JSON document — used by the editor
  content?: Record<string, unknown>;
  // Pre-rendered HTML — used for SSR/SEO
  contentHTML?: string;
  image?: string;
  metaImage?: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  readingTime?: number;
  author: {
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    content: { type: Schema.Types.Mixed },
    contentHTML: { type: String },
    image: { type: String },
    metaImage: { type: String },
    tags: { type: [String], default: [] },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    readingTime: { type: Number },
    author: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
  },
  { timestamps: true },
);

// Compound index for efficient slug + published queries
BlogPostSchema.index({ slug: 1, isPublished: 1 });
BlogPostSchema.index({ createdAt: -1 });

const BlogPostModel: Model<IBlogPost> =
  mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPostModel;
