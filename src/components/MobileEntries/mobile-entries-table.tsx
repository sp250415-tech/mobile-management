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
import { PlusIcon, Loader2Icon, CheckCircle2Icon, Pencil } from "lucide-react";
import { Eye } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";
import dayjs from "dayjs";

export type MobileEntry = {
  internalRef: string;
  date: string;
  status: "in progress" | "completed" | "todo" | "received";
  device: string;
  model: string;
  customer: string;
  contact: string;
  paymentStatus: "Paid" | "Pending" | "Credit" | null;
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
    color: "text-blue-600",
    icon: <Eye className="mr-1" size={16} />,
    label: "Received",
  },
};

interface Props {
  entries?: MobileEntry[];
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  onAdd: () => void;
  onEdit: (entry: MobileEntry) => void;
}

export const MobileEntriesTable: React.FC<Props> = ({ entries, page, pageSize, total, onPageChange, onAdd, onEdit, onPageSizeChange }) => {
  const [viewEntry, setViewEntry] = React.useState<any | null>(null);
  // Map entries to flat structure for table rendering
  const displayEntries = entries && entries.length > 0
    ? entries.map((item: any) => {
        if (item.entry && item.device && item.customer) {
          return {
            ...item.entry,
            device: item.device.deviceName,
            customer: item.customer.name,
            contact: item.customer.phone,
            model: item.model?.modelName || item.entry.model,
            // Preserve image URLs for view mode
            frontImage: item.frontImage || null,
            additionalImages: item.additionalImages || [],
          };
        }
        return item;
      })
    : [];
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
            <TableHead>External Ref</TableHead>
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
              <TableCell colSpan={10} className="text-center text-muted-foreground">No entries found.</TableCell>
            </TableRow>
          ) : (
            displayEntries.map((entry, idx) => {
              const statusKey = typeof entry.status === "string" ? entry.status.toLowerCase() as keyof typeof statusMap : "todo";
              const status = statusMap[statusKey] ?? statusMap["todo"];
              return (
                <TableRow key={idx}>
                  <TableCell className="px-2 py-2 text-left align-middle">{entry.internalRef}</TableCell>
                  <TableCell className="px-2 py-2 text-left align-middle">{entry.externalRef || "-"}</TableCell>
                  <TableCell className="px-2 py-2 text-left align-middle">{formatDate(entry.date)}</TableCell>
                  <TableCell className="px-2 py-2 text-left align-middle">
                    <span className={`inline-flex items-center font-medium ${status?.color ?? ""}`}>
                      {status?.icon}
                      {status?.label}
                    </span>
                  </TableCell>
                  <TableCell className="px-2 py-2 text-left align-middle">{entry.device}</TableCell>
                  <TableCell className="px-2 py-2 text-left align-middle">{entry.model}</TableCell>
                  <TableCell className="px-2 py-2 text-left align-middle">{entry.customer}</TableCell>
                  <TableCell className="px-2 py-2 text-left align-middle">{entry.contact}</TableCell>
                  <TableCell className="px-2 py-2 text-left align-middle">{entry.paymentStatus}</TableCell>
                  <TableCell className="px-2 py-2 text-left align-middle flex gap-2">
                    <Dialog open={viewEntry?.internalRef === entry.internalRef} onOpenChange={open => !open && setViewEntry(null)}>
                      <DialogTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={() => setViewEntry(entry)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <div className="space-y-4">
                          <h2 className="text-lg font-semibold mb-4 text-center">Mobile Entry Details</h2>
                          {viewEntry && (
                            <>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                  ["date", "Received Date"],
                                  ["internalRef", "Internal Ref"],
                                  ["externalRef", "External Ref"],
                                  ["customer", "Customer"],
                                  ["contact", "Phone"],
                                  ["device", "Device"],
                                  ["model", "Model"],
                                  ["imei", "IMEI"],
                                  ["issue", "Issue"],
                                  ["passcode", "Passcode"],
                                  ["status", "Status"],
                                  ["paymentStatus", "Payment Status"],
                                  ["estimate", "Estimated Amount"],
                                ]
                                  .filter(([key]) => viewEntry[key] !== undefined && viewEntry[key] !== null)
                                  .map(([key, label]) => {
                                    let value = viewEntry[key];
                                    if (key === "date" && value) {
                                      value = dayjs(value).format("DD-MMM-YYYY");
                                    }
                                    return (
                                      <div key={key} className="flex flex-col border rounded p-2 bg-muted/50">
                                        <span className="text-xs font-semibold text-muted-foreground mb-1">{label}</span>
                                        <span className="text-sm break-words">{String(value)}</span>
                                      </div>
                                    );
                                  })}
                              </div>
                              
                              {/* Front Image */}
                              {viewEntry.frontImage && (
                                <div className="mt-4 border rounded p-3 bg-muted/50">
                                  <span className="text-xs font-semibold text-muted-foreground mb-2 block">Front Image</span>
                                  <a 
                                    href={viewEntry.frontImage} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-blue-600 hover:underline text-sm"
                                  >
                                    View Front Image
                                  </a>
                                </div>
                              )}
                              
                              {/* Additional Images */}
                              {viewEntry.additionalImages && Array.isArray(viewEntry.additionalImages) && viewEntry.additionalImages.length > 0 && (
                                <div className="mt-4 border rounded p-3 bg-muted/50">
                                  <span className="text-xs font-semibold text-muted-foreground mb-2 block">Additional Images ({viewEntry.additionalImages.length})</span>
                                  <div className="flex flex-col gap-2">
                                    {viewEntry.additionalImages.map((url: string, idx: number) => (
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
                            </>
                          )}
                        </div>
                        <DialogClose asChild>
                          <Button className="mt-6 w-full" variant="outline">Close</Button>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
                    <Button size="icon" variant="ghost" onClick={() => onEdit(entry)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
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
