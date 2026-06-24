import { z } from "zod";

export const baseSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(32, { message: "Password can’t be longer than 32 characters." }),

  otp: z
    .string()
    .regex(/^\d{6}$/, {
      message: "OTP must be exactly 6 digits.",
    }),
});
