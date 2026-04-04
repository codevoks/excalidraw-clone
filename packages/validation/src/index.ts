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
  id: z.string().uuid(),
  left: z.number(),
  top: z.number(),
  width: z.number(),
  height: z.number(),
});

export const RectangleUpdateSchema = z
  .object({
    type: z.literal(SHAPES_NAMES.RECTANGLE),
    left: z.number().optional(),
    top: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  })
  .refine(
    (p) =>
      p.left !== undefined ||
      p.top !== undefined ||
      p.width !== undefined ||
      p.height !== undefined,
    { message: "patch must include at least one field" },
  );

export type RectangleType = z.infer<typeof RectangleSchema>;

export type ShapeNameType = SHAPES_NAMES;

export const ShapeSchema = z.discriminatedUnion("type", [RectangleSchema]);

export type ShapeType = z.infer<typeof ShapeSchema>;

export const ShapeUpdateSchema = z.discriminatedUnion("type", [
  RectangleUpdateSchema,
]);

export enum OPS_NAMES {
  ADD = "add",
  DELETE = "delete",
  UPDATE = "update",
}

export const AddOpSchema = z.object({
  kind: z.literal("op"),
  op: z.literal(OPS_NAMES.ADD),
  shape: ShapeSchema,
});

export const DeleteOpSchema = z.object({
  kind: z.literal("op"),
  op: z.literal(OPS_NAMES.DELETE),
  id: z.string().uuid(),
});

export const UpdateOpSchema = z.object({
  kind: z.literal("op"),
  op: z.literal(OPS_NAMES.UPDATE),
  id: z.string().uuid(),
  update: ShapeUpdateSchema,
});

export const OpSchema = z.discriminatedUnion("op", [
  AddOpSchema,
  DeleteOpSchema,
  UpdateOpSchema,
]);
