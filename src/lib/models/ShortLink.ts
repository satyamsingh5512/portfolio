import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * "external" links show the interstitial page (destination preview + "Go to the
 * link" + portfolio discovery). "blog" links point at a post on this site and
 * redirect straight through — an interstitial in front of your own content adds
 * friction for no gain.
 */
export type ShortLinkKind = "external" | "blog";

export interface IShortLink extends Document {
  _id: mongoose.Types.ObjectId;
  /** 4–5 character base62 slug served from the site root, e.g. satym.in/aB3x */
  code: string;
  /**
   * Destination. Absolute URL for "external" links, site-relative path
   * (e.g. /blog/my-post) for "blog" links.
   */
  url: string;
  kind: ShortLinkKind;
  /** Set for kind === "blog" — the post this code resolves to. */
  blogSlug?: string;
  /** Optional label shown on the interstitial page. */
  title?: string;
  description?: string;
  tags: string[];
  isActive: boolean;
  expiresAt?: Date | null;
  /** Interstitial page loads (or redirects served, for blog links). */
  views: number;
  /** Outbound clicks on "Go to the link". */
  clicks: number;
  lastViewedAt?: Date | null;
  lastClickedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ShortLinkSchema = new Schema<IShortLink>(
  {
    code: { type: String, required: true, unique: true, index: true },
    url: { type: String, required: true },
    kind: {
      type: String,
      enum: ["external", "blog"],
      default: "external",
      index: true,
    },
    blogSlug: { type: String, default: undefined, index: true },
    title: { type: String },
    description: { type: String },
    tags: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    lastViewedAt: { type: Date, default: null },
    lastClickedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

const ShortLinkModel: Model<IShortLink> =
  mongoose.models.ShortLink ||
  mongoose.model<IShortLink>("ShortLink", ShortLinkSchema);

export default ShortLinkModel;
