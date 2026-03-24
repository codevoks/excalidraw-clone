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
