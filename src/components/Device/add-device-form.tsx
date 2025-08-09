import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { deviceSchema, type DeviceFormValues } from "../schema";

interface AddDeviceFormProps {
  onSubmit: (data: DeviceFormValues) => void;
  onCancel: () => void;
  defaultValues?: DeviceFormValues;
}

export const AddDeviceForm: React.FC<AddDeviceFormProps> = ({ onSubmit, onCancel, defaultValues }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
      <h2 className="text-lg font-semibold mb-2 text-center">Add Device</h2>
      <div className="space-y-1">
        <Label htmlFor="deviceName" className="flex items-center gap-1">
          Device Name <span className="text-red-500">*</span>
        </Label>
        <Input id="deviceName" {...register("deviceName")} required aria-required="true" />
        {errors.deviceName && <p className="text-red-500 text-xs mt-1">{errors.deviceName.message}</p>}
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
