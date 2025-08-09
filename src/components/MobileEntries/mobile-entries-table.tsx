import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon, Loader2Icon, CheckCircle2Icon, XCircleIcon, Pencil } from "lucide-react";

export type MobileEntry = {
  internalRef: string;
  date: string;
  status: "in progress" | "completed" | "todo";
  device: string;
  model: string;
  customer: string;
  contact: string;
  paymentStatus: "Paid" | "Pending" | "Credit";
};

const sampleEntries: MobileEntry[] = [
  {
    internalRef: "INT001",
    date: "2025-08-01",
    status: "completed",
    device: "iPhone 14",
    model: "A2897",
    customer: "John Doe",
    contact: "9876543210",
    paymentStatus: "Paid",
  },
  {
    internalRef: "INT002",
    date: "2025-08-02",
    status: "in progress",
    device: "Samsung S23",
    model: "SM-S911B",
    customer: "Jane Smith",
    contact: "9123456780",
    paymentStatus: "Pending",
  },
];

const statusMap = {
  "in progress": {
    color: "text-yellow-600",
    icon: <Loader2Icon className="animate-spin mr-1" size={16} />,
    label: "In Progress",
  },
  completed: {
    color: "text-green-600",
    icon: <CheckCircle2Icon className="mr-1" size={16} />,
    label: "Completed",
  },
  todo: {
    color: "text-red-600",
    icon: <XCircleIcon className="mr-1" size={16} />,
    label: "To Do",
  },
};

interface Props {
  entries?: MobileEntry[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onAdd: () => void;
  onEdit: (entry: MobileEntry) => void;
}

export const MobileEntriesTable: React.FC<Props> = ({ entries, page, pageSize, total, onPageChange, onAdd, onEdit }) => {
  const displayEntries = entries && entries.length > 0 ? entries : sampleEntries;
  const totalPages = Math.ceil(total / pageSize);

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 w-full md:px-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Mobile Entries</h3>
        <Button onClick={onAdd} className="gap-2" size="sm">
          <PlusIcon size={18} /> Add
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Internal Ref</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayEntries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">No entries found.</TableCell>
            </TableRow>
          ) : (
            displayEntries.map((entry, idx) => (
              <TableRow key={idx}>
                <TableCell className="px-2 py-2 text-left align-middle">{entry.internalRef}</TableCell>
                <TableCell className="px-2 py-2 text-left align-middle">{formatDate(entry.date)}</TableCell>
                <TableCell className="px-2 py-2 text-left align-middle">
                  <span className={`inline-flex items-center font-medium ${statusMap[entry.status].color}`}>
                    {statusMap[entry.status].icon}
                    {statusMap[entry.status].label}
                  </span>
                </TableCell>
                <TableCell className="px-2 py-2 text-left align-middle">{entry.device}</TableCell>
                <TableCell className="px-2 py-2 text-left align-middle">{entry.model}</TableCell>
                <TableCell className="px-2 py-2 text-left align-middle">{entry.customer}</TableCell>
                <TableCell className="px-2 py-2 text-left align-middle">{entry.contact}</TableCell>
                <TableCell className="px-2 py-2 text-left align-middle">{entry.paymentStatus}</TableCell>
                <TableCell className="px-2 py-2 text-left align-middle">
                  <Button size="icon" variant="ghost" onClick={() => onEdit(entry)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex justify-end items-center gap-2 mt-4">
        <Button size="sm" variant="outline" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
          Prev
        </Button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <Button size="sm" variant="outline" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
};

// Usage example:
// <MobileEntriesTable page={1} pageSize={10} total={2} onPageChange={() => {}} onAdd={() => {}} onEdit={() => {}} />
