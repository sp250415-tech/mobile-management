import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { modelSchema, type ModelFormValues } from "../schema";
import { useGetDevices } from "../../service/api";

interface AddModelFormProps {
  onSubmit: (data: ModelFormValues) => void;
  onCancel: () => void;
  defaultValues?: ModelFormValues;
}

export const AddModelForm: React.FC<AddModelFormProps> = ({ onSubmit, onCancel, defaultValues }) => {
  const { data: devices = [] } = useGetDevices();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ModelFormValues>({
    resolver: zodResolver(modelSchema),
    defaultValues,
  });

  const selectedDeviceId = watch("deviceId");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
      <h2 className="text-lg font-semibold mb-2 text-center">
        {defaultValues ? "Edit Model" : "Add Model"}
      </h2>
      
      <div className="space-y-1">
        <Label htmlFor="deviceId" className="flex items-center gap-1">
          Device <span className="text-red-500">*</span>
        </Label>
        <Select
          value={selectedDeviceId}
          onValueChange={(value) => setValue("deviceId", value, { shouldValidate: true })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Device" />
          </SelectTrigger>
          <SelectContent>
            {devices.map((device: any) => (
              <SelectItem key={device.id} value={String(device.id)}>
                {device.deviceName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.deviceId && <p className="text-red-500 text-xs mt-1">{errors.deviceId.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="modelName" className="flex items-center gap-1">
          Model Name <span className="text-red-500">*</span>
        </Label>
        <Input id="modelName" {...register("modelName")} required aria-required="true" />
        {errors.modelName && <p className="text-red-500 text-xs mt-1">{errors.modelName.message}</p>}
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};
