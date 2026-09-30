import mongoose from "mongoose";

// Cached connection for Next.js hot-reload compatibility
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // allow global `var` declarations
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? {
  conn: null,
  promise: null,
};
global._mongooseCache = cached;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  // Checked lazily (not at import time) so that pages which merely import a
  // model can still render their config fallback when the DB is not configured.
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please define MONGODB_URI in your .env.local file");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        dbName: "portfolio",
        bufferCommands: false,
      })
      .catch((err) => {
        // Don't cache a failed connection attempt forever.
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
