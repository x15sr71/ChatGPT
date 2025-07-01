// lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");

interface MongooseGlobal {
  conn: typeof mongoose | null;
  promise: ReturnType<typeof mongoose.connect> | null;
}

// Extend the global object with our custom mongoose cache
declare global {
  var mongoose: MongooseGlobal | undefined;
}

const globalWithMongoose = global as typeof globalThis & {
  mongoose?: MongooseGlobal;
};

let cached = globalWithMongoose.mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  globalWithMongoose.mongoose = cached;

  return cached.conn;
}

export default dbConnect;
