// Dropdown options constants


export const PRODUCT_STATUS_OPTIONS = [
	"Received",
	"In progress",
	"Return",
	"Ready",
	"Delivered"
] as const;

export const PRODUCT_STATUS_COLORS: Record<string, string> = {
	"Received": "bg-white text-black border border-gray-300",
	"In progress": "bg-yellow-200 text-yellow-800",
	"Return": "bg-red-200 text-red-800",
	"Ready": "bg-purple-200 text-purple-800",
	"Delivered": "bg-green-200 text-green-800",
};

export const PAYMENT_STATUS_OPTIONS = ["Received", "Not received", "Partial"] as const;

export const PAYMENT_MODE_OPTIONS = ["UPI", "Card", "Cash"] as const;

// Type exports for TypeScript
export type ProductStatus = typeof PRODUCT_STATUS_OPTIONS[number];
export type PaymentStatus = typeof PAYMENT_STATUS_OPTIONS[number];
export type PaymentMode = typeof PAYMENT_MODE_OPTIONS[number];
