import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../ui/table";
import { Button } from "../ui/button";
import { Pencil, Trash2, Plus, CheckCircle2, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export interface Customer {
  id: string | number;
  name: string;
  phone: string;
  email: string;
  isActive: boolean;
  status?: "Active" | "Inactive";
}

interface CustomerTableProps {
  customers: Customer[];
  onAdd: () => void;
  onToggle: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({ customers, onAdd, onToggle, onEdit, onDelete, page, pageSize, total, onPageChange, onPageSizeChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 w-full md:px-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Customers</h3>
        <Button onClick={onAdd} className="gap-2" size="sm">
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow className="align-middle">
            <TableCell className="text-left font-semibold w-1/4 max-w-[160px] truncate">Name</TableCell>
            <TableCell className="text-left font-semibold w-1/6 max-w-[120px] truncate">Phone</TableCell>
            <TableCell className="text-left font-semibold w-1/4 max-w-[160px] truncate">Email</TableCell>
            <TableCell className="text-left font-semibold w-1/6">Status</TableCell>
            <TableCell className="text-left font-semibold whitespace-nowrap w-[120px]">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">No customers found.</TableCell>
            </TableRow>
          ) : (
            customers.map((customer, idx) => (
              <TableRow key={idx} className="align-middle">
                <TableCell className="text-left align-middle max-w-[160px] truncate" title={customer.name}>{customer.name}</TableCell>
                <TableCell className="text-left align-middle max-w-[120px] truncate" title={customer.phone}>{customer.phone}</TableCell>
                <TableCell className="text-left align-middle max-w-[160px] truncate" title={customer.email}>{customer.email}</TableCell>
                <TableCell className="text-left align-middle">
                  {customer.isActive ? (
                    <span className="inline-flex items-center gap-1 text-green-600"><CheckCircle2 className="w-4 h-4" /> Active</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600"><XCircle className="w-4 h-4" /> Inactive</span>
                  )}
                </TableCell>
                <TableCell className="flex gap-2 items-center whitespace-nowrap">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" onClick={() => onToggle(customer)}>
                        {customer.isActive ? <XCircle className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4 text-green-600" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{customer.isActive ? "Disable" : "Enable"}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" onClick={() => onEdit(customer)}><Pencil className="w-4 h-4" /></Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" onClick={() => onDelete(customer)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
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
