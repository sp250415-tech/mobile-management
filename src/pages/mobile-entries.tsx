import { useState } from "react";
import { Sheet, SheetContent } from "../components/ui/sheet";
import { MobileEntriesTable } from "../components/MobileEntries/mobile-entries-table";
import { AddMobileEntries } from "../components/MobileEntries/add-mobile-entries";
import Loader from "../components/ui/loader";
import { toast } from "sonner";
import {
  useGetEntries,
  useAddEntry,
  useUpdateEntry,
} from "../service/api";

const MobileEntries: React.FC = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"add" | "edit">("add");
  const [editingEntry, setEditingEntry] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: entries = [], isLoading } = useGetEntries();
  const addEntry = useAddEntry();
  const updateEntry = useUpdateEntry();

  const total = entries.length;
  const paginatedEntries = entries.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleAdd = () => {
    setSheetMode("add");
    setEditingEntry(null);
    setSheetOpen(true);
  };

  const handleEdit = (entry: any) => {
    setSheetMode("edit");
    setEditingEntry(entry);
    setSheetOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (sheetMode === "add") {
      addEntry.mutate(data, {
        onSuccess: () => {
          toast.success("Entry added successfully");
          setSheetOpen(false);
        },
        onError: (error: any) => {
          const errorMessage = error?.message || error?.info?.message || "Failed to add entry";
          toast.error(errorMessage);
        },
      });
    } else if (sheetMode === "edit" && editingEntry) {
      updateEntry.mutate(
        { ...editingEntry, ...data },
        {
          onSuccess: () => {
            toast.success("Entry updated successfully");
            setSheetOpen(false);
          },
          onError: (error: any) => {
            const errorMessage = error?.message || error?.info?.message || "Failed to update entry";
            toast.error(errorMessage);
          },
        }
      );
    }
  };

  return (
    <div className="w-full mx-auto">
      {isLoading ? (
        <Loader />
      ) : (
        <MobileEntriesTable
          entries={paginatedEntries}
          onAdd={handleAdd}
          onEdit={handleEdit}
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={size => { setPageSize(size); setPage(1); }}
        />
      )}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent 
          side="right" 
          className="w-[400px] overflow-hidden"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <AddMobileEntries
            onSubmitEntry={handleFormSubmit}
            onClose={() => setSheetOpen(false)}
            entry={sheetMode === "edit" ? editingEntry : undefined}
            mode={sheetMode}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileEntries;
