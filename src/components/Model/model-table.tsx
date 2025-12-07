import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../ui/table";
import { Button } from "../ui/button";
import { Pencil, Plus, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export interface Model {
  id: string | number;
  deviceId: string | number;
  modelName: string;
  isActive: boolean;
}

interface ModelTableProps {
  models: Model[];
  devices: any[];
  onAdd: () => void;
  onToggle: (model: Model) => void;
  onEdit: (model: Model) => void;
  onDelete: (model: Model) => void;
}

export const ModelTable: React.FC<ModelTableProps> = ({ 
  models, 
  devices,
  onAdd, 
  onToggle, 
  onEdit,
  onDelete
}) => {
  // Helper function to get device name by id
  const getDeviceName = (deviceId: string | number) => {
    const device = devices.find((d) => String(d.id) === String(deviceId));
    return device?.deviceName || `Device ${deviceId}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 w-full md:px-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Models</h3>
        <Button onClick={onAdd} className="gap-2" size="sm">
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow className="align-middle">
            <TableCell className="text-left font-semibold w-1/3 max-w-[200px] truncate">Device</TableCell>
            <TableCell className="text-left font-semibold w-1/3 max-w-[250px] truncate">Model Name</TableCell>
            <TableCell className="text-left font-semibold w-1/6">Status</TableCell>
            <TableCell className="text-left font-semibold whitespace-nowrap w-[120px]">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">No models found.</TableCell>
            </TableRow>
          ) : (
            models.map((model) => (
              <TableRow key={model.id} className="align-middle">
                <TableCell className="text-left align-middle max-w-[200px] truncate" title={getDeviceName(model.deviceId)}>
                  {getDeviceName(model.deviceId)}
                </TableCell>
                <TableCell className="text-left align-middle max-w-[250px] truncate" title={model.modelName}>
                  {model.modelName}
                </TableCell>
                <TableCell className="text-left align-middle">
                  {model.isActive ? (
                    <span className="inline-flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="w-4 h-4" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600">
                      <XCircle className="w-4 h-4" /> Inactive
                    </span>
                  )}
                </TableCell>
                <TableCell className="flex gap-2 items-center whitespace-nowrap">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" onClick={() => onToggle(model)}>
                        {model.isActive ? (
                          <XCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{model.isActive ? "Disable" : "Enable"}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" onClick={() => onEdit(model)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" onClick={() => onDelete(model)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
