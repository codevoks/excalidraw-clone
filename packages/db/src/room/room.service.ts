import { db } from "../client";
import { Room } from "@prisma/client";
import { handleDbError } from "../errors";

export async function createRoomBySlug(slug: string): Promise<Room> {
  try {
    const newRoom = await db.room.create({ data: { slug } });
    return newRoom;
  } catch (error) {
    handleDbError("createRoomBySlug", error);
  }
}

export async function getRoomBySlug(slug: string): Promise<Room | null> {
  try {
    const room = await db.room.findUnique({ where: { slug } });
    return room;
  } catch (error) {
    handleDbError("getRoomBySlug", error);
  }
}
