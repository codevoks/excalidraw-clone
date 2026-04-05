import { NextResponse } from "next/server";
import { db, getRoomBySlug } from "@repo/db";
import { getSessionUser } from "../../../../lib/auth";
import { slugifyRoomName } from "../../../../lib/roomSlug";

function isPrismaUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "P2002"
  );
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ message: "Not signed in." }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
    }

    const name =
      typeof body === "object" &&
      body !== null &&
      "name" in body &&
      typeof (body as { name: unknown }).name === "string"
        ? (body as { name: string }).name
        : null;

    if (name === null) {
      return NextResponse.json({ message: "Field `name` is required." }, { status: 400 });
    }

    const slug = slugifyRoomName(name);
    if (!slug) {
      return NextResponse.json(
        { message: "Enter a room name with letters or numbers." },
        { status: 400 },
      );
    }

    const existing = await getRoomBySlug(slug);
    if (existing) {
      return NextResponse.json(
        { message: "A room with this name already exists." },
        { status: 409 },
      );
    }

    try {
      const room = await db.room.create({ data: { slug } });
      return NextResponse.json({ room: { id: room.id, slug: room.slug } }, { status: 201 });
    } catch (error) {
      if (isPrismaUniqueViolation(error)) {
        return NextResponse.json(
          { message: "A room with this name already exists." },
          { status: 409 },
        );
      }
      throw error;
    }
  } catch {
    return NextResponse.json({ message: "Could not create room." }, { status: 500 });
  }
}
