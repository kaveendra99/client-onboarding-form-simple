import { z } from "zod";

const servicesEnum = z.enum(["UI/UX", "Branding", "Web Dev", "Mobile App"]);

export const onboardingSchema = z.object({
  fullName: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be less than 80 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Only letters, spaces, hyphens, and apostrophes allowed"),

  email: z.string().email("Please enter a valid email"),

  companyName: z.string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters"),

  services: z.array(servicesEnum)
    .min(1, "Please select at least one service"),

  budgetUsd: z.number()
    .int("Must be a whole number")
    .min(100, "Minimum budget is $100")
    .max(1000000, "Maximum budget is $1,000,000")
    .optional()
    .or(z.literal("")),

  projectStartDate: z.string()
    .refine(val => new Date(val) >= new Date(new Date().setHours(0, 0, 0, 0)), 
    { message: "Start date must be today or in the future" }),

  acceptTerms: z.boolean()
    .refine(val => val, "You must accept the terms")
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;