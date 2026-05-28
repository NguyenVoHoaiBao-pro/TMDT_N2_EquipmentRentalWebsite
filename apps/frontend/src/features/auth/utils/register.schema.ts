import { fullNameRegex, passwordRegex, phoneRegex } from '@/features/auth/utils/auth.utils.ts';

import { z } from 'zod';

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: 'Full name is required' })
      .regex(fullNameRegex, { message: 'Full name must contain only letters and spaces' }),

    username: z.string().min(1, { message: 'Username is required' }),

    phoneNumber: z
      .string()
      .min(1, { message: 'Phone number is required' })
      .regex(phoneRegex, { message: 'Phone number must be exactly 10 digits' }),

    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Invalid email address' }),

    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(passwordRegex, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),

    confirmPassword: z
      .string()
      .min(8, { message: 'Confirm password must be at least 8 characters' }),
  })
  // superRefine is now clean and dedicated ONLY to cross-field validation
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'], // Correctly maps the error to the confirmPassword UI field
      });
    }
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
