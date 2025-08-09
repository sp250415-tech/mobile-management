import { z } from "zod";

// Entries
export const AddEntriesSchema = z.object({
  date: z
    .preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof String) {
        return new Date(arg as string);
      }
      return arg;
    }, z.date())
    .refine((d) => d instanceof Date && !isNaN(d.getTime()), {
      message: "Date is required",
    }),
  internalRef: z.string().min(1, "Internal Reference is required"),
  externalRef: z.string().optional(),
  customer: z.string().min(1, "Customer is required"),
  contact: z.string().optional(),
  device: z.string().min(1, "Device is required"),
  model: z.string().min(1, "Model is required"),
  imei: z.string().optional(),
  issue: z.string().min(1, "Issue is required"),
  passcode: z.string().optional(),
  estimate: z.string().default("0"),
  productStatus: z.string().min(1, "Product Status is required"),
  paymentStatus: z.enum(["Received", "Not received", "Credit"]),
  frontImages: z.any().optional(),
  backImages: z
    .any()
    .refine(
      (files) => files && files.length > 0,
      "At least one back image is required"
    ),
});

export type FormData = z.infer<typeof AddEntriesSchema>;

// Customers
export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required").max(10, "Phone number should have a maximum of 10 numbers"),
  email: z.string().email("Invalid email address"),
  status: z.enum(["Active", "Inactive"]),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

// Devices
export const deviceSchema = z.object({
  deviceName: z.string().min(1, "Device name is required"),
});

export type DeviceFormValues = z.infer<typeof deviceSchema>;