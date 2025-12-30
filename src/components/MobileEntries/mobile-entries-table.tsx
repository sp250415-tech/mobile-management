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
import { PlusIcon, Pencil, Printer } from "lucide-react";

// Print label component for barcode printer
const PrintLabel: React.FC<{ entry: any; onClose: () => void }> = ({ entry, onClose }) => {
  const dateStr = entry.date ? dayjs(entry.date).format("DD-MMM-YYYY") : "";
  React.useEffect(() => {
    const printWindow = window.open('', '', 'width=200,height=100');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
      <head>
        <style>
          @page {
            size: 5cm 2.5cm landscape;
            margin: 0;
          }
          @media print {
            html, body { margin: 0; padding: 0; width: 5cm; height: 2.5cm; }
            body { margin: 0; padding: 0; }
            .label {
              width: 5cm; height: 2.5cm;
              min-width: 189px; min-height: 95px;
              max-width: 5cm; max-height: 2.5cm;
              font-size: 10pt;
              padding: 0.2cm 0.3cm;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: flex-start;
            }
            .label strong { font-size: 11pt; }
            .barcode { font-size: 12pt; font-weight: bold; letter-spacing: 2px; }
          }
        </style>
      </head>
      <body style="margin:0;padding:0;width:5cm;height:2.5cm;">
        <div class="label">
          <div><span>${dateStr}</span> - <span class="barcode">${entry.internalRef}</span></div>
          <div><strong>${entry.customer}</strong></div>
          <div>${entry.model}</div>
          <div>${entry.issue || ''}</div>
        </div>
        <script>window.print(); window.onafterprint = window.close;</script>
      </body>
      </html>
    `);
    printWindow.document.close();
    if (onClose) onClose();
  }, [entry, onClose, dateStr]);
  return null;
};

// Print dialog button
const PrintDialogButton: React.FC<{ entry: any }> = ({ entry }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button size="icon" variant="ghost" onClick={() => setOpen(true)} title="Print Label">
        <Printer className="w-4 h-4" />
      </Button>
      {open && <PrintLabel entry={entry} onClose={() => setOpen(false)} />}
    </>
  );
};
import { Eye } from "lucide-react";
import { PRODUCT_STATUS_COLORS, PRODUCT_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "../../constants";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";
import dayjs from "dayjs";

export type MobileEntry = {
  internalRef: string;
  date: string;
  status: string;
  device: string;
  model: string;
  customer: string;
  contact: string;
  paymentStatus: string | null;
};


const statusLabelMap: Record<string, string> = {
  "Received": "Received",
  "In progress": "In progress",
  "Return": "Return",
  "Ready": "Ready",
  "Delivered": "Delivered",
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
              // Only show allowed status values
              const allowedStatus = PRODUCT_STATUS_OPTIONS.includes(entry.status);
              const statusColor = PRODUCT_STATUS_COLORS[entry.status] || "bg-gray-200 text-gray-800";
              // Highlight Sale entries
              const isSale = entry.entryType === "Sale";
              return (
                <TableRow key={idx} className={isSale ? "bg-yellow-100" : ""}>
                  <TableCell className="px-2 py-2 text-left align-middle">{entry.internalRef}</TableCell>
                  <TableCell className="px-2 py-2 text-left align-middle">{entry.externalRef || "-"}</TableCell>
                  <TableCell className="px-2 py-2 text-left align-middle">{formatDate(entry.date)}</TableCell>
                  <TableCell className="px-2 py-2 text-left align-middle">
                    {allowedStatus ? (
                      <span className={`inline-flex items-center font-medium px-2 py-1 rounded ${statusColor}`}>
                        {statusLabelMap[entry.status] || entry.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center font-medium px-2 py-1 rounded bg-gray-200 text-gray-800">
                        {entry.status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-2 py-2 text-left align-middle">{entry.device}</TableCell>
                  <TableCell className="px-2 py-2 text-left align-middle">{entry.model}</TableCell>
                  <TableCell className="px-2 py-2 text-left align-middle">{entry.customer}</TableCell>
                  <TableCell className="px-2 py-2 text-left align-middle">{entry.contact}</TableCell>
                  <TableCell className="px-2 py-2 text-left align-middle">
                    {PAYMENT_STATUS_OPTIONS.includes(entry.paymentStatus || "") ? (
                      <span>{entry.paymentStatus}</span>
                    ) : (
                      <span className="text-gray-400">{entry.paymentStatus}</span>
                    )}
                  </TableCell>
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
                              

                              {/* Front Image Preview with Download */}
                              {viewEntry.frontImage && (
                                <div className="mt-4 border rounded p-3 bg-muted/50">
                                  <span className="text-xs font-semibold text-muted-foreground mb-2 block">Front Image</span>
                                  <img
                                    src={viewEntry.frontImage}
                                    alt="Front Preview"
                                    className="max-h-48 rounded shadow mb-2 border"
                                    style={{ objectFit: "contain", width: "auto" }}
                                  />
                                  <a
                                    href={viewEntry.frontImage}
                                    download
                                    className="mt-1 inline-block text-blue-600 hover:underline text-xs"
                                  >
                                    Download Image
                                  </a>
                                </div>
                              )}

                              {/* Additional Images Preview with Download */}
                              {viewEntry.additionalImages && Array.isArray(viewEntry.additionalImages) && viewEntry.additionalImages.length > 0 && (
                                <div className="mt-4 border rounded p-3 bg-muted/50">
                                  <span className="text-xs font-semibold text-muted-foreground mb-2 block">Additional Images ({viewEntry.additionalImages.length})</span>
                                  <div className="flex flex-wrap gap-4">
                                    {viewEntry.additionalImages.map((url: string, idx: number) => (
                                      <div key={idx} className="flex flex-col items-center">
                                        <img
                                          src={url}
                                          alt={`Additional Preview ${idx + 1}`}
                                          className="max-h-32 rounded shadow mb-1 border"
                                          style={{ objectFit: "contain", width: "auto" }}
                                        />
                                        <a
                                          href={url}
                                          download
                                          className="mt-1 inline-block text-blue-600 hover:underline text-xs"
                                        >
                                          Download Image
                                        </a>
                                      </div>
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
                    <PrintDialogButton entry={entry} />
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
