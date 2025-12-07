import React, { useState } from "react";
import { Sheet, SheetContent } from "../components/ui/sheet";
import { DeviceTable } from "../components/Device/device-table";
import { AddDeviceForm } from "../components/Device/add-device-form";
import Loader from "../components/ui/loader";
import { toast } from "sonner";
import {
  useGetDevices,
  useAddDevice,
  useUpdateDevice,
  useDeleteDevice,
} from '../service/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

export interface Device {
  id: string;
  deviceName: string;
  isActive: boolean;
}

const Devices: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [sheetMode, setSheetMode] = useState<'add' | 'edit'>('add');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);

  // API hooks
  const { data: devices = [], isLoading } = useGetDevices();
  const addDevice = useAddDevice();
  const updateDevice = useUpdateDevice();
  const deleteDevice = useDeleteDevice();

  const handleAdd = () => {
    setEditingDevice(null);
    setSheetMode('add');
    setSheetOpen(true);
  };

  const handleEdit = (device: Device) => {
    setEditingDevice(device);
    setSheetMode('edit');
    setSheetOpen(true);
  };

  const handleDelete = (device: Device) => {
    setDeviceToDelete(device);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deviceToDelete && (deviceToDelete as any).id) {
      deleteDevice.mutate((deviceToDelete as any).id, {
        onSuccess: () => {
          toast.success("Device deleted successfully");
          setDeleteDialogOpen(false);
          setDeviceToDelete(null);
        },
        onError: (error: any) => {
          const errorMessage = error?.message || error?.info?.message || "Failed to delete device";
          toast.error(errorMessage);
        },
      });
    }
  };

  const handleToggle = (device: Device) => {
    if (device && (device as any).id) {
      const newIsActive = !device.isActive;
      updateDevice.mutate({ ...device, isActive: newIsActive }, {
        onSuccess: () => {
          toast.success(newIsActive ? "Device enabled successfully" : "Device disabled successfully");
        },
        onError: (error: any) => {
          const errorMessage = error?.message || error?.info?.message || "Failed to update device status";
          toast.error(errorMessage);
        },
      });
    }
  };

  const handleFormSubmit = (data: { deviceName: string }) => {
    if (sheetMode === 'add') {
      addDevice.mutate({ ...data, isActive: true }, {
        onSuccess: () => {
          toast.success("Device added successfully");
          setSheetOpen(false);
        },
        onError: (error: any) => {
          const errorMessage = error?.message || error?.info?.message || "Failed to add device";
          toast.error(errorMessage);
        },
      });
    } else if (sheetMode === 'edit' && editingDevice && (editingDevice as any).id) {
      updateDevice.mutate({ ...editingDevice, deviceName: data.deviceName }, {
        onSuccess: () => {
          toast.success("Device updated successfully");
          setSheetOpen(false);
        },
        onError: (error: any) => {
          const errorMessage = error?.message || error?.info?.message || "Failed to update device";
          toast.error(errorMessage);
        },
      });
    }
  };

  // Pagination logic
  const total = devices.length;
  const paginatedDevices = devices.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full mx-auto">
      {isLoading ? (
        <Loader />
      ) : (
        <DeviceTable
          devices={paginatedDevices}
          onAdd={handleAdd}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={size => { setPageSize(size); setPage(1); }}
        />
      )}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-[400px] overflow-y-auto">
          <AddDeviceForm
            onSubmit={handleFormSubmit}
            onCancel={() => setSheetOpen(false)}
            defaultValues={sheetMode === 'edit' && editingDevice ? editingDevice : undefined}
          />
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Device</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to delete <strong>{deviceToDelete?.deviceName}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Devices;
