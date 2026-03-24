import type { User } from "@prisma/client";
import { db } from "../client";
import { handleDbError } from "../errors";

type PublicUser = Pick<User, "id" | "email" | "createdAt" | "updatedAt">;

export const userService = {
  async findByEmail(email: string) {
    try {
      return await db.user.findUnique({ where: { email } });
    } catch (error) {
      handleDbError("findByEmail", error);
    }
  },

  async findPublicById(id: number): Promise<PublicUser | null> {
    try {
      return await db.user.findUnique({
        where: { id },
        select: { id: true, email: true, createdAt: true, updatedAt: true },
      });
    } catch (error) {
      handleDbError("findPublicById", error);
    }
  },

  async create(email: string, passwordHash: string): Promise<PublicUser> {
    try {
      return await db.user.create({
        data: { email, passwordHash },
        select: { id: true, email: true, createdAt: true, updatedAt: true },
      });
    } catch (error) {
      handleDbError("createUser", error);
    }
  },
};
