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
  customer: z.string(),
  contact: z.string(),
  device: z.string(),
  model: z.string(),
  imei: z.string().optional(),
  issue: z.string().optional(),
  passcode: z.string().optional(),
  estimate: z.string().default("0"),
  entryType: z.enum(["Service", "Sale"]),
  productStatus: z.string(),
  paymentStatus: z.enum(["Received", "Not received", "Partial"]),
  paymentMode: z.enum(["UPI", "Card", "Cash"]).optional(),
  frontImages: z.any(),
  additionalImages: z.any().optional(),
  partNumberOrName: z.string().optional(),
  price: z.string().optional(),
}).superRefine((data, ctx) => {
  // For Sale, only these fields are required
  if (data.entryType === "Sale") {
    if (!data.customer || data.customer.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Customer is required", path: ["customer"] });
    }
    if (!data.contact || data.contact.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Contact is required", path: ["contact"] });
    }
    if (!data.model || data.model.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Model is required", path: ["model"] });
    }
    if (!data.device || data.device.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Device is required", path: ["device"] });
    }
    if (!data.partNumberOrName || data.partNumberOrName.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Part number or name is required", path: ["partNumberOrName"] });
    }
    if (!data.price || data.price === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Price is required", path: ["price"] });
    }
    if (!data.productStatus || data.productStatus.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Product Status is required", path: ["productStatus"] });
    }
    if (!data.paymentStatus || data.paymentStatus.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Payment Status is required", path: ["paymentStatus"] });
    }
    if (!data.frontImages || !data.frontImages.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Front Image is required", path: ["frontImages"] });
    }
    // paymentMode is required ONLY when paymentStatus is "Received"
    if (data.paymentStatus === "Received" && !data.paymentMode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Payment Mode is required when Payment Status is Received",
        path: ["paymentMode"],
      });
    }
  } else {
    // For Service, keep previous logic (if any required fields for Service, add here)
    if (!data.date || !(data.date instanceof Date) || isNaN(data.date.getTime())) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Date is required", path: ["date"] });
    }
    if (!data.internalRef || data.internalRef.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Internal Reference is required", path: ["internalRef"] });
    }
    if (!data.customer || data.customer.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Customer is required", path: ["customer"] });
    }
    if (!data.device || data.device.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Device is required", path: ["device"] });
    }
    if (!data.model || data.model.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Model is required", path: ["model"] });
    }
    if (!data.issue || data.issue.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Issue is required", path: ["issue"] });
    }
    if (!data.productStatus || data.productStatus.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Product Status is required", path: ["productStatus"] });
    }
    if (!data.paymentStatus || data.paymentStatus.trim() === "") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Payment Status is required", path: ["paymentStatus"] });
    }
    if (!data.frontImages || !data.frontImages.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Front Image is required", path: ["frontImages"] });
    }
    if (data.paymentStatus === "Received" && !data.paymentMode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Payment Mode is required when Payment Status is Received",
        path: ["paymentMode"],
      });
    }
  }
});
export type FormData = z.infer<typeof AddEntriesSchema>;