// Dropdown options constants

export const PRODUCT_STATUS_OPTIONS = ["Received", "In Progress", "Delivered"] as const;

export const PAYMENT_STATUS_OPTIONS = ["Received", "Not received", "Credit"] as const;

export const PAYMENT_MODE_OPTIONS = ["UPI", "Card", "Cash"] as const;

// Type exports for TypeScript
export type ProductStatus = typeof PRODUCT_STATUS_OPTIONS[number];
export type PaymentStatus = typeof PAYMENT_STATUS_OPTIONS[number];
export type PaymentMode = typeof PAYMENT_MODE_OPTIONS[number];
