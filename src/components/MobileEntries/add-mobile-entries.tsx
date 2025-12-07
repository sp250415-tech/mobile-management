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
import { ChevronDownIcon, Plus, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import { AddEntriesSchema } from "../schema";
import { useGetCustomers, useGetDevices, useAddCustomer, useAddDevice, useGetModels, useAddModel, useGetNextEntryId } from "../../service/api";
import { AddCustomerForm } from "../Customer/add-customer-form";
import { AddDeviceForm } from "../Device/add-device-form";
import { PRODUCT_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS, PAYMENT_MODE_OPTIONS } from "../../constants";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface AddMobileEntriesProps {
  onSubmitEntry?: (entry: any) => void;
  onClose?: () => void;
  entry?: any;
  mode?: "add" | "edit";
}

export const AddMobileEntries: React.FC<AddMobileEntriesProps> = ({
  onSubmitEntry,
  onClose,
  entry,
  mode = "add",
}) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [open, setOpen] = React.useState(false);
  // file previews state
  const [frontPreviews, setFrontPreviews] = React.useState<string[]>([]);
  const [additionalPreviews, setAdditionalPreviews] = React.useState<string[]>([]);
  const [frontFiles, setFrontFiles] = React.useState<File[]>([]);
  const [additionalFiles, setAdditionalFiles] = React.useState<File[]>([]);
  const [viewing, setViewing] = React.useState<"front" | "additional" | null>(null);
  // Existing image URLs from API (for edit mode)
  const [existingFrontImage, setExistingFrontImage] = React.useState<string | null>(null);
  const [existingAdditionalImages, setExistingAdditionalImages] = React.useState<string[]>([]);
  // Dialog states for adding customer/device
  const [showAddCustomer, setShowAddCustomer] = React.useState(false);
  const [showAddDevice, setShowAddDevice] = React.useState(false);
  const [showModelConfirm, setShowModelConfirm] = React.useState(false);
  const [modelSearchValue, setModelSearchValue] = React.useState("");
  const [showModelDropdown, setShowModelDropdown] = React.useState(false);
  const [showPasscode, setShowPasscode] = React.useState(false);
  const [forceUpdate, setForceUpdate] = React.useState(0);
  
  // Fetch customers and devices from API
  const { data: customers = [], isLoading: loadingCustomers, refetch: refetchCustomers } =
    useGetCustomers();
  const { data: devices = [], isLoading: loadingDevices, refetch: refetchDevices } = useGetDevices();
  
  // Fetch next entry ID only in add mode
  const { data: nextEntryId } = useGetNextEntryId();
  
  // Mutations for adding customer/device/model
  const addCustomerMutation = useAddCustomer();
  const addDeviceMutation = useAddDevice();
  const addModelMutation = useAddModel();
  // Only show active customers and devices
  const activeCustomers = customers.filter((c: any) => c.isActive);
  const activeDevices = devices.filter((d: any) => d.isActive);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(AddEntriesSchema),
    defaultValues: {
      date: new Date(),
  estimate: "0",
  productStatus: "Received",
  paymentStatus: "Not received",
    },
  });

  // Get selected device ID for fetching models
  const selectedDeviceName = watch("device");
  const selectedDevice = devices.find((d: any) => d.deviceName === selectedDeviceName);
  const selectedDeviceId = selectedDevice?.id;
  
  // In edit mode, we also need to fetch models for the entry's device
  const editModeDeviceId = mode === "edit" && entry ? (entry.device?.id || entry.entry?.device?.id) : null;
  const deviceIdForModels = selectedDeviceId || editModeDeviceId;
  
  // Fetch models based on selected device or edit mode device
  const { data: models = [] } = useGetModels(deviceIdForModels);

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
    paymentMode?: string;
    frontImages?: FileList;
    additionalImages?: FileList;
  }

  const onSubmit = (data: AddMobileEntryFormValues) => {
  // Ensure defaults are present even if the user didn't interact with the selects
  if (!data.productStatus) data.productStatus = "Received";
  if (!data.paymentStatus) data.paymentStatus = "Not received";

    // Remove IQTC prefix from internalRef before sending to API
    let internalRefValue = data.internalRef;
    // if (internalRefValue && internalRefValue.startsWith("IQTC")) {
    //   internalRefValue = internalRefValue.replace("IQTC", "");
    // }

    // Find IDs from names
    const selectedCustomer = customers.find((c: any) => c.name === data.customer);
    const selectedDevice = devices.find((d: any) => d.deviceName === data.device);
    const selectedModel = models.find((m: any) => m.modelName === data.model);

    // Create JSON payload for addEntryRequest
    const entryRequest = {
      internalRef: internalRefValue,
      externalRef: data.externalRef || null,
      imei: data.imei || null,
      issue: data.issue,
      passCode: data.passcode || null,
      date: data.date instanceof Date ? data.date.toISOString() : data.date,
      status: data.productStatus,
      estimatedAmount: data.estimate || "0",
      deviceId: selectedDevice?.id,
      modelId: selectedModel?.id,
      customerId: selectedCustomer?.id,
      contact: data.contact || null,
      paymentStatus: data.paymentStatus,
      paymentMode: data.paymentMode || null,
    };

    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    // Add JSON data as a Blob with application/json content type
    const jsonBlob = new Blob([JSON.stringify(entryRequest)], {
      type: 'application/json'
    });
    formData.append('addEntryRequest', jsonBlob);
    
    // Add front image if exists
    if (frontFiles.length > 0) {
      formData.append('frontImage', frontFiles[0]);
    }
    
    // Add additional images if exist
    if (additionalFiles.length > 0) {
      additionalFiles.forEach((file) => {
        formData.append('additionalImages', file);
      });
    }

    // Debug: Log FormData contents
    console.log("=== FormData Debug ===");
    console.log("Entry Request:", JSON.stringify(entryRequest, null, 2));
    console.log("Front Files:", frontFiles);
    console.log("Additional Files:", additionalFiles);
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    if (onSubmitEntry) {
      onSubmitEntry(formData);
    } else {
      alert("Submitted!");
    }
  reset();
  setDate(new Date());
  // cleanup previews after submit
  frontPreviews.forEach((u) => URL.revokeObjectURL(u));
  additionalPreviews.forEach((u) => URL.revokeObjectURL(u));
  setFrontPreviews([]);
  setAdditionalPreviews([]);
  setFrontFiles([]);
  setAdditionalFiles([]);
    if (onClose) onClose();
  };

  React.useEffect(() => {
    const currentCustomer = watch("customer");
    if (currentCustomer) {
      const found = activeCustomers.find((c: any) => c.name === currentCustomer);
      if (found && found.phone) setValue("contact", found.phone);
    }
    // only run when customer list or selected customer changes
  }, [watch, setValue, activeCustomers, watch("customer")]);

  // Ensure form has default statuses set on mount
  React.useEffect(() => {
    setValue("productStatus", "Received");
    setValue("paymentStatus", "Not received");
  }, [setValue]);

  // Set internal ref from API in add mode with IQTC prefix for display
  React.useEffect(() => {
    if (mode === "add" && nextEntryId) {
      setValue("internalRef", `IQTC${nextEntryId}`);
    }
  }, [mode, nextEntryId, setValue]);

  // Prefill form when editing an entry
  React.useEffect(() => {
    if (mode === "edit" && entry) {
      // Extract data from nested structure (API response format)
      // The table flattens the data, so customer, device, and model are already strings
      const entryData = entry.entry || entry;
      
      // Customer, device, and model are already flattened to strings by the table
      const customerData = entry.customer || entryData.customer;
      const deviceData = entry.device || entryData.device;
      const modelData = entry.model;
      
      const currentInternalRef = watch("internalRef");
      // Guard: only run if form hasn't been populated yet
      if (currentInternalRef === entryData.internalRef) {
        return; // Already populated
      }

      // map incoming entry fields to form fields where names match
      const vals: any = {
        date: new Date(entryData.date || entry.date),
        internalRef: entryData.internalRef || entry.internalRef,
        externalRef: entryData.externalRef || entry.externalRef,
        customer: typeof customerData === 'string' ? customerData : customerData?.name,
        contact: entryData.contact || entry.contact,
        device: typeof deviceData === 'string' ? deviceData : deviceData?.deviceName,
        model: typeof modelData === 'string' ? modelData : modelData?.modelName,
        imei: entryData.imei || entry.imei,
        issue: entryData.issue || entry.issue,
        passcode: entryData.passCode || entryData.passcode || entry.passCode || entry.passcode,
        estimate: (entryData.estimatedAmount || entry.estimatedAmount)?.toString?.() ?? (entryData.estimatedAmount || entry.estimatedAmount) ?? "0",
        productStatus: entryData.status || entry.status, 
        paymentStatus: entryData.paymentStatus || entry.paymentStatus,
      };
      
      console.log("Edit mode - Setting form values:", vals);
      
      reset(vals);
      
      // Explicitly set Select values after reset to ensure they bind
      // Use setTimeout to ensure reset completes first
      setTimeout(() => {
        if (vals.customer) setValue("customer", vals.customer);
        if (vals.device) setValue("device", vals.device);
        if (vals.model) setValue("model", vals.model);
        if (vals.productStatus) setValue("productStatus", vals.productStatus);
        if (vals.paymentStatus) setValue("paymentStatus", vals.paymentStatus);
        setForceUpdate(prev => prev + 1); // Force re-render
        console.log("After setValue, form values:", { customer: watch("customer"), device: watch("device"), model: watch("model") });
      }, 0);

      // Set existing images from API response
      if (entry.frontImage) {
        setExistingFrontImage(entry.frontImage);
      }
      if (entry.additionalImages && Array.isArray(entry.additionalImages) && entry.additionalImages.length > 0) {
        setExistingAdditionalImages(entry.additionalImages);
      }
    }
  }, [mode, entry, watch, reset]);

  // cleanup object URLs on unmount
  React.useEffect(() => {
    return () => {
      frontPreviews.forEach((u) => URL.revokeObjectURL(u));
      additionalPreviews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [frontPreviews, additionalPreviews]);

  // Handler for adding new customer
  const handleAddCustomer = async (data: any) => {
    try {
      await addCustomerMutation.mutateAsync(data);
      refetchCustomers();
      setShowAddCustomer(false);
    } catch (error) {
      console.error("Failed to add customer:", error);
    }
  };

  // Handler for adding new device
  const handleAddDevice = async (data: any) => {
    try {
      await addDeviceMutation.mutateAsync(data);
      refetchDevices();
      setShowAddDevice(false);
    } catch (error) {
      console.error("Failed to add device:", error);
    }
  };

  // Handler for adding new model
  const handleAddModel = async () => {
    if (!selectedDeviceId || !modelSearchValue.trim()) return;
    try {
      await addModelMutation.mutateAsync({
        deviceId: selectedDeviceId,
        modelName: modelSearchValue.trim(),
      });
      setValue("model", modelSearchValue.trim());
      setShowModelConfirm(false);
      setModelSearchValue("");
      toast.success("Model added successfully");
    } catch (error: any) {
      const errorMessage = error?.message || error?.info?.message || "Failed to add model";
      toast.error(errorMessage);
      console.error("Failed to add model:", error);
    }
  };

  // Filter models based on search
  const filteredModels = React.useMemo(() => {
    if (!modelSearchValue) return models;
    return models.filter((m: any) =>
      m.modelName?.toLowerCase().includes(modelSearchValue.toLowerCase())
    );
  }, [models, modelSearchValue]);

  const modelExists = filteredModels.some(
    (m: any) => m.modelName?.toLowerCase() === modelSearchValue.toLowerCase()
  );

  return (
    <form
      className="space-y-6 p-4 md:p-6 bg-white rounded-lg shadow-sm h-[100vh] flex flex-col"
      onSubmit={handleSubmit(onSubmit as any)}
    >
      <h2 className="text-lg font-bold mb-4 text-center">Add Mobile Entry</h2>
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2">
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
          <Label className="mb-1 flex items-center gap-1">
            Internal Reference <span className="text-red-500">*</span>
          </Label>
          <Input 
            {...register("internalRef")} 
            disabled
            className="bg-gray-100 cursor-not-allowed"
          />
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
          <div className="flex items-center justify-between mb-1">
            <Label className="flex items-center gap-1">
              Customer <span className="text-red-500">*</span>
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddCustomer(true)}
              className="h-7 px-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          <Select key={`customer-${forceUpdate}`} value={watch("customer") || ""} onValueChange={(val) => setValue("customer", val)}>
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loadingCustomers ? "Loading..." : "Select customer"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {activeCustomers.length === 0 && !loadingCustomers ? (
                <SelectItem value="no-customer" disabled>
                  No customers found
                </SelectItem>
              ) : (
                activeCustomers.map((c: any) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))
              )}
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
          <Input {...register("contact")} disabled className="bg-gray-100" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="flex items-center gap-1">
              Device <span className="text-red-500">*</span>
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddDevice(true)}
              className="h-7 px-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          <Select key={`device-${forceUpdate}`} value={watch("device") || ""} onValueChange={(val) => setValue("device", val)}>
            <SelectTrigger>
              <SelectValue
                placeholder={loadingDevices ? "Loading..." : "Select device"}
              />
            </SelectTrigger>
            <SelectContent>
              {activeDevices.length === 0 && !loadingDevices ? (
                <SelectItem value="no-device" disabled>
                  No devices found
                </SelectItem>
              ) : (
                activeDevices.map((d: any) => (
                  <SelectItem key={d.id} value={d.deviceName}>
                    {d.deviceName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.device && (
            <span className="text-red-500 text-xs">
              {errors.device.message}
            </span>
          )}
        </div>

        <div>
          <Label className="mb-1 flex items-center gap-1">
            Model <span className="text-red-500">*</span>
          </Label>
          <Popover open={showModelDropdown} onOpenChange={setShowModelDropdown}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={showModelDropdown}
                className="w-full justify-between"
                disabled={!watch("device")}
                type="button"
              >
                {watch("model") || "Select or type model..."}
                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Search or type model..."
                  value={modelSearchValue}
                  onValueChange={(value) => {
                    setModelSearchValue(value);
                  }}
                />
                <CommandList>
                  <CommandEmpty>
                    {modelSearchValue && !modelExists && (
                      <div className="p-2">
                        <p className="text-sm text-muted-foreground mb-2">
                          Model "{modelSearchValue}" not found
                        </p>
                        <Button
                          size="sm"
                          onClick={() => setShowModelConfirm(true)}
                          className="w-full"
                          type="button"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add "{modelSearchValue}"
                        </Button>
                      </div>
                    )}
                    {!modelSearchValue && <p className="p-2 text-sm">Type to search models...</p>}
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredModels.map((model: any) => (
                      <CommandItem
                        key={model.id}
                        value={model.modelName}
                        onSelect={() => {
                          setValue("model", model.modelName);
                          setModelSearchValue("");
                          setShowModelDropdown(false);
                        }}
                      >
                        {model.modelName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.model && (
            <span className="text-red-500 text-xs">{errors.model.message}</span>
          )}
        </div>

        <div>
          <Label className="mb-1">IMEI/SERIAL</Label>
          <Input {...register("imei")} />
        </div>

        <div>
          <Label className="mb-1 flex items-center gap-1">
            Issue <span className="text-red-500">*</span>
          </Label>
          <Textarea {...register("issue")} />
          {errors.issue && (
            <span className="text-red-500 text-xs">{errors.issue.message}</span>
          )}
        </div>

        <div>
          <Label className="mb-1">PASSCODE</Label>
          <div className="relative">
            <Input 
              type={showPasscode ? "text" : "password"} 
              {...register("passcode")} 
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPasscode(!showPasscode)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasscode ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <Label className="mb-1">Estimate</Label>
          <Input type="number" {...register("estimate")} />
        </div>

        <div>
          <Label className="mb-1 flex items-center gap-1">
            Product Status <span className="text-red-500">*</span>
          </Label>
          <Select value={watch("productStatus")} onValueChange={(val) => setValue("productStatus", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_STATUS_OPTIONS.map((opt) => (
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
          <Label className="mb-1 flex items-center gap-1">
            Payment Status <span className="text-red-500">*</span>
          </Label>
          <Select value={watch("paymentStatus")} onValueChange={(val: any) => setValue("paymentStatus", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment status" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_STATUS_OPTIONS.map((opt) => (
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
          <Label className="mb-1 flex items-center gap-1">
            Payment Mode 
            {watch("paymentStatus") === "Received" && (
              <span className="text-red-500">*</span>
            )}
          </Label>
          <Select 
            value={watch("paymentMode")} 
            onValueChange={(val: any) => setValue("paymentMode", val)}
            disabled={watch("paymentStatus") !== "Received"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment mode" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_MODE_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.paymentMode && (
            <span className="text-red-500 text-xs">
              {errors.paymentMode.message}
            </span>
          )}
        </div>

        <div>
          <Label className="mb-1 flex items-center gap-1">
            Front Image <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const list = e.target.files;
              if (!list || list.length === 0) return;
              const file = list[0]; // Single file only
              // Check file size
              if (file.size > 8 * 1024 * 1024) {
                alert("File size must be less than 8MB");
                e.target.value = ""; // Reset input
                return;
              }
              setFrontFiles([file]);
              setFrontPreviews([URL.createObjectURL(file)]);
              // update form value with files
              setValue("frontImages", list, { shouldValidate: true });
            }}
          />
          {errors.frontImages && (
            <span className="text-red-500 text-xs">
              {errors.frontImages.message as string}
            </span>
          )}
          {/* Show existing image from API (edit mode) */}
          {existingFrontImage && frontFiles.length === 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Existing Image:</p>
              <a 
                href={existingFrontImage} 
                target="_blank" 
                rel="noreferrer" 
                className="text-blue-600 hover:underline text-sm"
              >
                View Current Front Image
              </a>
            </div>
          )}
          {/* Show newly selected file */}
          {frontFiles.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Selected: {frontFiles[0].name}</p>
              <Button type="button" onClick={() => setViewing("front")}>
                View Front Image
              </Button>
            </div>
          )}
        </div>

        <div>
          <Label className="mb-1">Additional Images</Label>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const list = e.target.files;
              if (!list) return;
              const arr: File[] = Array.from(list);
              const valid: File[] = [];
              const previews: string[] = [];
              for (const f of arr) {
                if (f.size > 8 * 1024 * 1024) {
                  continue;
                }
                valid.push(f);
                previews.push(URL.createObjectURL(f));
              }
              setAdditionalFiles(valid);
              setAdditionalPreviews(previews);
              setValue("additionalImages", list, { shouldValidate: true });
            }}
          />
          {/* Show existing images from API (edit mode) */}
          {existingAdditionalImages.length > 0 && additionalFiles.length === 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Existing Images ({existingAdditionalImages.length}):</p>
              <div className="flex flex-col gap-1">
                {existingAdditionalImages.map((url, idx) => (
                  <a 
                    key={idx}
                    href={url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Additional Image {idx + 1}
                  </a>
                ))}
              </div>
            </div>
          )}
          {/* Show newly selected files */}
          {additionalFiles.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">
                Selected: {additionalFiles.map(f => f.name).join(", ")}
              </p>
              <Button type="button" onClick={() => setViewing("additional")}>
                View Additional Images ({additionalFiles.length})
              </Button>
            </div>
          )}
        </div>
        {/* Dialog for viewing uploaded files */}
        <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
          <DialogTrigger asChild>
            {/* invisible trigger - we open programmatically */}
            <div />
          </DialogTrigger>
          <DialogContent className="max-w-2xl w-full">
            <h3 className="font-semibold text-lg mb-4">
              Viewing {viewing === "front" ? "Front Image" : "Additional Images"}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {(viewing === "front" ? frontPreviews : additionalPreviews).map(
                (src, idx) => (
                  <div key={idx} className="flex flex-col items-start gap-2">
                    <img src={src} alt={`preview-${idx}`} className="max-h-64" />
                    <a href={src} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                      Open in new tab
                    </a>
                  </div>
                )
              )}
            </div>
            <div className="flex justify-end mt-4">
              <DialogClose asChild>
                <Button onClick={() => setViewing(null)}>Close</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog for adding new customer */}
        <Dialog open={showAddCustomer} onOpenChange={setShowAddCustomer}>
          <DialogContent className="max-w-md">
            <AddCustomerForm
              onSubmit={handleAddCustomer}
              onCancel={() => setShowAddCustomer(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog for adding new device */}
        <Dialog open={showAddDevice} onOpenChange={setShowAddDevice}>
          <DialogContent className="max-w-md">
            <AddDeviceForm
              onSubmit={handleAddDevice}
              onCancel={() => setShowAddDevice(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog for confirming new model addition */}
        <Dialog open={showModelConfirm} onOpenChange={setShowModelConfirm}>
          <DialogContent className="max-w-md">
            <h3 className="font-semibold text-lg mb-4">Add New Model</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Do you want to add "{modelSearchValue}" as a new model?
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowModelConfirm(false);
                  setModelSearchValue("");
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddModel}
              >
                Yes, Add Model
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Button type="submit" className="w-full mt-2">
        Submit
      </Button>
    </form>
  );
};
