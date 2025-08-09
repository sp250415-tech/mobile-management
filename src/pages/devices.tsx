import React, { useState } from "react";
import { Sheet, SheetContent } from "../components/ui/sheet";
import DeviceTableComponent from "../components/Device/DeviceTableComponent";
import { AddDeviceForm } from "../components/Device/add-device-form";

export interface Device {
  id: string;
  deviceName: string;
  enabled: boolean;
}

const initialDevices: Device[] = [
  { id: "1", deviceName: "iPhone 14", enabled: true },
  { id: "2", deviceName: "Samsung Galaxy S23", enabled: false },
  { id: "3", deviceName: "Pixel 7", enabled: true },
];

const Devices: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [sheetMode, setSheetMode] = useState<'add' | 'edit'>('add');

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
    setDevices((prev) => prev.filter((d) => d.id !== device.id));
  };

  const handleToggle = (device: Device) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === device.id ? { ...d, enabled: !d.enabled } : d
      )
    );
  };

  const handleFormSubmit = (data: { deviceName: string }) => {
    if (sheetMode === 'add') {
      setDevices((prev) => [
        ...prev,
        { id: String(Date.now()), deviceName: data.deviceName, enabled: true }
      ]);
    } else if (sheetMode === 'edit' && editingDevice) {
      setDevices((prev) => prev.map((d) =>
        d.id === editingDevice.id ? { ...d, deviceName: data.deviceName } : d
      ));
    }
    setSheetOpen(false);
  };

  // Pagination logic
  const total = devices.length;
  const paginatedDevices = devices.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <DeviceTableComponent
        devices={paginatedDevices}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggle={handleToggle}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
      />
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-[400px] overflow-y-auto">
          <AddDeviceForm
            onSubmit={handleFormSubmit}
            onCancel={() => setSheetOpen(false)}
            defaultValues={sheetMode === 'edit' && editingDevice ? { deviceName: editingDevice.deviceName } : undefined}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Devices;
