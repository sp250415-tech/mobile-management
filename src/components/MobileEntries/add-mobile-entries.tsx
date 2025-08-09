import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { ChevronDownIcon } from "lucide-react";
import { AddEntriesSchema } from "../schema";

const customerOptions = ["Customer 1", "Customer 2", "Customer 3"];
const deviceOptions = ["Device 1", "Device 2", "Device 3"];
const productStatusOptions = ["Received", "In Progress", "Delivered"];
const paymentStatusOptions = ["Received", "Not received", "Credit"];

interface AddMobileEntriesProps {
  onSubmitEntry?: (entry: any) => void;
  onClose?: () => void;
}

export const AddMobileEntries: React.FC<AddMobileEntriesProps> = ({
  onSubmitEntry,
  onClose,
}) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    // watch,
  } = useForm({
    resolver: zodResolver(AddEntriesSchema),
    defaultValues: {
      date: new Date(),
      estimate: "0",
    },
  });

  // Watch file fields for validation
  // const backImages = watch("backImages");

  // Define the type for your form fields
  interface AddMobileEntryFormValues {
    date: Date | string;
    internalRef?: string;
    externalRef?: string;
    customer?: string;
    contact?: string;
    device?: string;
    model?: string;
    imei?: string;
    issue?: string;
    passcode?: string;
    estimate?: string;
    productStatus?: string;
    paymentStatus?: string;
    frontImages?: FileList;
    backImages?: FileList;
  }

  const onSubmit = (data: AddMobileEntryFormValues) => {
    // Convert file inputs to arrays for easier handling
    const frontImages =
      data.frontImages && data.frontImages.length > 0
        ? Array.from(data.frontImages)
        : [];
    const backImages =
      data.backImages && data.backImages.length > 0
        ? Array.from(data.backImages)
        : [];

    // Convert date to ISO string for backend or display
    const formData = {
      ...data,
      date: data.date instanceof Date ? data.date.toISOString() : data.date,
      frontImages,
      backImages,
    };

    if (onSubmitEntry) {
      onSubmitEntry(formData);
    } else {
      alert("Submitted! " + JSON.stringify(formData, null, 2));
    }
    reset();
    setDate(new Date());
    if (onClose) onClose();
  };

  return (
    <form
      className="space-y-6 p-4 md:p-6 bg-white rounded-lg shadow-sm"
      onSubmit={handleSubmit(onSubmit as any)}
    >
      <h2 className="text-lg font-bold mb-4 text-center">Add Mobile Entry</h2>
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="date" className="px-1 flex items-center gap-1">
              Date <span className="text-red-500">*</span>
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-48 justify-between font-normal"
                >
                  {date ? date.toLocaleDateString() : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDate(date);
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          {errors.date && (
            <span className="text-red-500 text-xs">
              {errors.date.message as string}
            </span>
          )}
        </div>

        <div>
          <Label className="mb-1 flex items-center gap-1">Internal Reference <span className="text-red-500">*</span></Label>
          <Input {...register("internalRef")} />
          {errors.internalRef && (
            <span className="text-red-500 text-xs">
              {errors.internalRef.message}
            </span>
          )}
        </div>

        <div>
          <Label className="mb-1">External Reference</Label>
          <Input {...register("externalRef")} />
        </div>

        <div>
          <Label className="mb-1 flex items-center gap-1">Customer <span className="text-red-500">*</span></Label>
          <Select onValueChange={(val) => setValue("customer", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              {customerOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.customer && (
            <span className="text-red-500 text-xs">
              {errors.customer.message}
            </span>
          )}
        </div>

        <div>
          <Label className="mb-1">Contact</Label>
          <Input {...register("contact")} />
        </div>

        <div>
          <Label className="mb-1 flex items-center gap-1">Device <span className="text-red-500">*</span></Label>
          <Select onValueChange={(val) => setValue("device", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select device" />
            </SelectTrigger>
            <SelectContent>
              {deviceOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.device && (
            <span className="text-red-500 text-xs">
              {errors.device.message}
            </span>
          )}
        </div>

        <div>
          <Label className="mb-1 flex items-center gap-1">Model <span className="text-red-500">*</span></Label>
          <Input {...register("model")} />
          {errors.model && (
            <span className="text-red-500 text-xs">{errors.model.message}</span>
          )}
        </div>

        <div>
          <Label className="mb-1">IMEI/SERIAL</Label>
          <Input {...register("imei")} />
        </div>

        <div>
          <Label className="mb-1 flex items-center gap-1">Issue <span className="text-red-500">*</span></Label>
          <Textarea {...register("issue")} />
          {errors.issue && (
            <span className="text-red-500 text-xs">{errors.issue.message}</span>
          )}
        </div>

        <div>
          <Label className="mb-1">PASSCODE</Label>
          <Input type="password" {...register("passcode")} />
        </div>

        <div>
          <Label className="mb-1">Estimate</Label>
          <Input type="number" {...register("estimate")} />
        </div>

        <div>
          <Label className="mb-1 flex items-center gap-1">Product Status <span className="text-red-500">*</span></Label>
          <Select onValueChange={(val) => setValue("productStatus", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {productStatusOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.productStatus && (
            <span className="text-red-500 text-xs">
              {errors.productStatus.message}
            </span>
          )}
        </div>

        <div>
          <Label className="mb-1 flex items-center gap-1">Payment Status <span className="text-red-500">*</span></Label>
          <Select onValueChange={(val: any) => setValue("paymentStatus", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment status" />
            </SelectTrigger>
            <SelectContent>
              {paymentStatusOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.paymentStatus && (
            <span className="text-red-500 text-xs">
              {errors.paymentStatus.message}
            </span>
          )}
        </div>

        <div>
          <Label className="mb-1">Add Front Image</Label>
          <Input type="file" multiple {...register("frontImages")} />
        </div>

        <div>
          <Label className="mb-1 flex items-center gap-1">Add Back Image <span className="text-red-500">*</span></Label>
          <Input type="file" multiple {...register("backImages")} />
          {errors.backImages && (
            <span className="text-red-500 text-xs">
              {errors.backImages.message as string}
            </span>
          )}
        </div>
      </div>
      <Button type="submit" className="w-full mt-2">
        Submit
      </Button>
    </form>
  );
};
