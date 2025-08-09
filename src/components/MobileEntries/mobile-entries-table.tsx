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
import { PlusIcon, Loader2Icon, CheckCircle2Icon, XCircleIcon } from "lucide-react";

export type MobileEntry = {
  internalRef: string;
  date: string;
  externalRef?: string;
  status: "in progress" | "completed" | "todo";
  device: string;
  model: string;
  customer: string;
  phone: string;
};

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
  entries: MobileEntry[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onAdd: () => void;
}

export const MobileEntriesTable: React.FC<Props> = ({ entries, page, pageSize, total, onPageChange, onAdd }) => {
  const totalPages = Math.ceil(total / pageSize);

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
            <TableHead>External Ref</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">No entries found.</TableCell>
            </TableRow>
          ) : (
            entries.map((entry, idx) => (
              <TableRow key={idx}>
                <TableCell>{entry.internalRef}</TableCell>
                <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                <TableCell>{entry.externalRef || "-"}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center font-medium ${statusMap[entry.status].color}`}>
                    {statusMap[entry.status].icon}
                    {statusMap[entry.status].label}
                  </span>
                </TableCell>
                <TableCell>{entry.device}</TableCell>
                <TableCell>{entry.model}</TableCell>
                <TableCell>{entry.customer}</TableCell>
                <TableCell>{entry.phone}</TableCell>
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
