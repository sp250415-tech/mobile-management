import { z } from "zod";

// Device schema
export const deviceSchema = z.object({
  deviceName: z.string().min(1, "Device name is required"),
});
export type DeviceFormValues = z.infer<typeof deviceSchema>;

// Model schema
export const modelSchema = z.object({
  deviceId: z.string().min(1, "Device is required"),
  modelName: z.string().min(1, "Model name is required"),
});
export type ModelFormValues = z.infer<typeof modelSchema>;

// Customer schema
export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  status: z.enum(["Active", "Inactive"]),
});
export type CustomerFormValues = z.infer<typeof customerSchema>;

// Entries schema
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
  paymentMode: z.enum(["UPI", "Card", "Cash"]).optional(),
  frontImages: z.any().refine((files) => files && files.length > 0, {
    message: "Front Image is required",
  }),
  additionalImages: z.any().optional(),
}).refine((data) => {
  // paymentMode is required when paymentStatus is "Received"
  if (data.paymentStatus === "Received" && !data.paymentMode) {
    return false;
  }
  return true;
}, {
  message: "Payment Mode is required when Payment Status is Received",
  path: ["paymentMode"],
});
export type FormData = z.infer<typeof AddEntriesSchema>;