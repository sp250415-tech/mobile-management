import React from "react";
import type { Device } from "@/pages/devices";
import { DeviceTable } from "./device-table";

interface DeviceTableComponentProps {
  devices: Device[];
  onAdd: () => void;
  onEdit: (device: Device) => void;
  onDelete: (device: Device) => void;
  onToggle: (device: Device) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

const DeviceTableComponent: React.FC<DeviceTableComponentProps> = (props) => {
  if (!DeviceTable) return <div>DeviceTable not found.</div>;
  return <DeviceTable onPageSizeChange={function (): void {
    throw new Error("Function not implemented.");
  } } {...props} />;
};

export default DeviceTableComponent;
