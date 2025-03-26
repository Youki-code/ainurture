import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').nonempty('Name is required'),
  email: z.string().email('Invalid email address').nonempty('Email is required'),
  phone: z.string().optional(),
  message: z.string().optional()
});