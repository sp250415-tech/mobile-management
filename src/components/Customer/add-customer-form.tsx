import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { customerSchema } from "../schema";

import type { SubmitHandler } from "react-hook-form";

type CustomerFormValues = {
  name: string;
  phone: string;
  email?: string;
  status: "Active" | "Inactive";
};
interface AddCustomerFormProps {
  onSubmit: SubmitHandler<CustomerFormValues>;
  onCancel: () => void;
  defaultValues?: CustomerFormValues;
}

export const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ onSubmit, onCancel, defaultValues }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      ...defaultValues,
      status: "Active",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
      <h2 className="text-lg font-semibold mb-2 text-center">Add Customer</h2>
      <div className="space-y-1">
        <Label htmlFor="name" className="flex items-center gap-1">
          Name <span className="text-red-500">*</span>
        </Label>
        <Input id="name" {...register("name")} required aria-required="true" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="phone" className="flex items-center gap-1">
          Phone <span className="text-red-500">*</span>
        </Label>
        <Input id="phone" {...register("phone")} required aria-required="true" />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" {...register("email")} />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>
  {/* Status is set to 'Active' by default and hidden from UI */}
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};
