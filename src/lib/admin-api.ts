import { NextResponse } from "next/server";
import mongoose from "mongoose";
import type * as z from "zod";

/**
 * Splits a flat DB patch into `$set` / `$unset`. Empty strings and nulls become
 * `$unset`, so clearing an optional field in the admin form actually clears it
 * (Mongoose silently drops `undefined` from `$set`, leaving the old value).
 */
export function toUpdate(patch: Record<string, unknown>): {
  $set: Record<string, unknown>;
  $unset?: Record<string, "">;
} {
  const $set: Record<string, unknown> = {};
  const $unset: Record<string, ""> = {};
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined || value === null || value === "") {
      $unset[key] = "";
    } else {
      $set[key] = value;
    }
  }
  return Object.keys($unset).length > 0 ? { $set, $unset } : { $set };
}

export function getObjectIdOrNull(
  id: string | null,
): mongoose.Types.ObjectId | null {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) return null;
  return new mongoose.Types.ObjectId(id);
}

/** 400 response naming the first invalid field, e.g. "companyUrl: Invalid url". */
export function validationError(label: string, error: z.ZodError) {
  const issue = error.issues[0];
  const where = issue?.path.join(".");
  return NextResponse.json(
    {
      error: `Invalid ${label}${where ? ` — ${where}` : ""}: ${issue?.message ?? "invalid value"}`,
      details: error.flatten(),
    },
    { status: 400 },
  );
}
