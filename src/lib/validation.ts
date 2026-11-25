import { z } from "zod";

/**
 * Normalizes an Indian phone input (strips spaces, hyphens, leading +91 or 0)
 * and validates that it is a valid 10-digit mobile number starting with 6–9.
 */
export function normalizeIndianPhone(raw: string): string {
  const digits = raw.replace(/[\s\-().+]/g, "");
  if (digits.startsWith("91") && digits.length === 12) {
    return digits.slice(2);
  }
  if (digits.startsWith("0") && digits.length === 11) {
    return digits.slice(1);
  }
  return digits;
}

export const indianPhoneSchema = z
  .string()
  .trim()
  .transform(normalizeIndianPhone)
  .refine((val) => /^[6-9]\d{9}$/.test(val), {
    message: "Enter a valid 10-digit Indian mobile number (starting with 6–9).",
  });

export const contactSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters.")
    .max(50, "First name must be under 50 characters."),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(50, "Last name must be under 50 characters."),
  phone: indianPhoneSchema,
  email: z
    .string()
    .trim()
    .email("Enter a valid email address."),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters.")
    .max(120, "Subject must be under 120 characters."),
  message: z
    .string()
    .trim()
    .min(10, "Please share at least 10 characters about your requirement.")
    .max(1500, "Message must be under 1500 characters."),
});

export function createAppointmentSchema(todayIso?: string) {
  const minDate = todayIso ?? new Date().toISOString().split("T")[0];
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters.")
      .max(80, "Name must be under 80 characters."),
    phone: indianPhoneSchema,
    email: z
      .string()
      .trim()
      .email("Enter a valid email address."),
    location: z
      .string()
      .trim()
      .min(2, "Enter your plot or project location (e.g., Coimbatore).")
      .max(120, "Location must be under 120 characters."),
    service: z
      .string()
      .trim()
      .min(1, "Please select a service."),
    date: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Select a valid date.")
      .refine((d) => d >= minDate, {
        message: "Consultation date cannot be in the past.",
      }),
    time: z
      .string()
      .trim()
      .regex(/^\d{2}:\d{2}$/, "Select a valid preferred time."),
    description: z
      .string()
      .trim()
      .max(1500, "Project brief must be under 1500 characters.")
      .optional()
      .default(""),
  });
}

export const appointmentSchema = createAppointmentSchema();

export const chatQuerySchema = z.object({
  query: z
    .string()
    .trim()
    .min(2, "Please enter a short question (at least 2 characters).")
    .max(400, "Keep your question under 400 characters."),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function validateWithSchema<T extends z.ZodTypeAny>(
  schema: T,
  payload: unknown
):
  | { success: true; data: z.infer<T>; errors: Record<string, never> }
  | { success: false; data: null; errors: FieldErrors<z.infer<T>> } {
  const result = schema.safeParse(payload);
  if (result.success) {
    return { success: true, data: result.data, errors: {} };
  }
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }
  return { success: false, data: null, errors: errors as FieldErrors<z.infer<T>> };
}
