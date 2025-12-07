import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../ui/table";
import { Button } from "../ui/button";
import { Pencil, Trash2, Plus, CheckCircle2, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export interface Device {
  id: string;
  deviceName: string;
  isActive: boolean;
}

interface DeviceTableProps {
  devices: Device[];
  onAdd: () => void;
  onEdit: (device: Device) => void;
  onDelete: (device: Device) => void;
  onToggle: (device: Device) => void;
  page: number;
  pageSize: number;
  total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export const DeviceTable: React.FC<DeviceTableProps> = ({ devices, onAdd, onEdit, onDelete, onToggle, page, pageSize, total, onPageChange, onPageSizeChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 w-full md:px-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Devices</h3>
        <Button onClick={onAdd} className="gap-2" size="sm">
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow className="align-middle">
            <TableCell className="text-left font-semibold w-2/3 max-w-[220px] truncate">Device Name</TableCell>
            <TableCell className="text-left font-semibold w-1/6">Status</TableCell>
            <TableCell className="text-left font-semibold whitespace-nowrap w-[120px]">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">No devices found.</TableCell>
            </TableRow>
          ) : (
            devices.map((device) => (
              <TableRow key={device.id} className="align-middle">
                <TableCell className="text-left align-middle max-w-[220px] truncate" title={device.deviceName}>{device.deviceName}</TableCell>
                <TableCell className="text-left align-middle">
                  {device.isActive ? (
                    <span className="inline-flex items-center gap-1 text-green-600"><CheckCircle2 className="w-4 h-4" /> Enabled</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600"><XCircle className="w-4 h-4" /> Disabled</span>
                  )}
                </TableCell>
                <TableCell className="flex gap-2 items-center whitespace-nowrap">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" onClick={() => onEdit(device)}><Pencil className="w-4 h-4" /></Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" onClick={() => onDelete(device)} disabled={!device.isActive}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" onClick={() => onToggle(device)}>
                        {device.isActive ? <XCircle className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4 text-green-600" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{device.isActive ? "Disable" : "Enable"}</TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {/* Pagination Controls */}
      <div className="flex justify-end items-center gap-2 mt-4">
          <label className="text-sm mr-2">Items per page:</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        <Button size="sm" variant="outline" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
          Prev
        </Button>
        <span className="text-sm">Page {page} of {totalPages}</span>
        <Button size="sm" variant="outline" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
};
