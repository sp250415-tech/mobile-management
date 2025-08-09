import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AddMobileEntries } from "@/components/MobileEntries/add-mobile-entries";
import { MobileEntriesTable } from "@/components/MobileEntries/mobile-entries-table";
import type { MobileEntry } from "@/components/MobileEntries/mobile-entries-table";

const PAGE_SIZE = 2;

export const MobileEntries = () => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    // This effect can be used for any initialization logic
    console.log("MobileEntries component mounted");
  }, []);

  const [entries, setEntries] = React.useState<MobileEntry[]>([]);
  const [page, setPage] = React.useState(1);

  // Add new entry handler
  const handleAddEntry = (
    entry: Omit<MobileEntry, "status"> & { status?: MobileEntry["status"] }
  ) => {
    setEntries((prev) => [
      {
        ...entry,
        status: entry.status || "in progress",
      },
      ...prev,
    ]);
    setOpen(false);
  };

  // Paginate entries
  const paginatedEntries = entries.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="w-full py-8">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="max-w-md w-full">
          <AddMobileEntries
            onSubmitEntry={(entry: any) => {
              handleAddEntry(entry);
            }}
            onClose={() => setOpen(false)}
          />
        </SheetContent>
        <MobileEntriesTable
          entries={paginatedEntries}
          page={page}
          pageSize={PAGE_SIZE}
          total={entries.length}
          onPageChange={setPage}
          onEdit={() => {
            setOpen(true);
            // Logic to handle editing an entry can be added here
          }}
          onAdd={() => setOpen(true)}
        />
      </Sheet>
    </div>
  );
};
