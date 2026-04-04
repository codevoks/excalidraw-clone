import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8).max(64),
});

export const signInSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8).max(64),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;

export enum SHAPES_NAMES {
  RECTANGLE = "rectangle",
}

export const RectangleSchema = z.object({
  type: z.nativeEnum(SHAPES_NAMES),
  left: z.number(),
  top: z.number(),
  width: z.number(),
  height: z.number(),
});

export type RectangleType = z.infer<typeof RectangleSchema>;

export type Shape = RectangleType;

export type ShapeType = SHAPES_NAMES;
