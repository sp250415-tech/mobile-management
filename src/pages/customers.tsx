import React, { useState } from "react";
import { Sheet, SheetContent } from "../components/ui/sheet";
import { CustomerTable } from "../components/Customer/customer-table";
import type { Customer } from "../components/Customer/customer-table";
import { AddCustomerForm } from "../components/Customer/add-customer-form";
import Loader from "../components/ui/loader";
import { toast } from "sonner";
import {
  useGetCustomers,
  useAddCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from '../service/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

const Customers: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [sheetMode, setSheetMode] = useState<'add' | 'edit' | 'view'>('add');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  // API hooks
  const { data: customers = [], isLoading } = useGetCustomers();
  const addCustomer = useAddCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const handleAdd = () => {
    setEditingCustomer(null);
    setSheetMode('add');
    setSheetOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setSheetMode('edit');
    setSheetOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (customerToDelete && (customerToDelete as any).id) {
      deleteCustomer.mutate((customerToDelete as any).id, {
        onSuccess: () => {
          toast.success("Customer deleted successfully");
          setDeleteDialogOpen(false);
          setCustomerToDelete(null);
        },
        onError: (error: any) => {
          const errorMessage = error?.message || error?.info?.message || "Failed to delete customer";
          toast.error(errorMessage);
        },
      });
    }
  };

  const handleFormSubmit = (data: Customer) => {
    if (sheetMode === 'add') {
      addCustomer.mutate({
        ...data,
        phone: data.phone,
      }, {
        onSuccess: () => {
          toast.success("Customer added successfully");
          setSheetOpen(false);
        },
        onError: (error: any) => {
          const errorMessage = error?.message || error?.info?.message || "Failed to add customer";
          toast.error(errorMessage);
        },
      });
    } else if (sheetMode === 'edit' && editingCustomer && (editingCustomer as any).id) {
      updateCustomer.mutate({
        ...data,
        phone: data.phone,
      }, {
        onSuccess: () => {
          toast.success("Customer updated successfully");
          setSheetOpen(false);
        },
        onError: (error: any) => {
          const errorMessage = error?.message || error?.info?.message || "Failed to update customer";
          toast.error(errorMessage);
        },
      });
    }
  };

  const handleToggle = (customer: Customer) => {
    if (customer && (customer as any).id) {
      // Toggle isActive and status
      const newIsActive = !customer.isActive;
      const newStatus = newIsActive ? 'Active' : 'Inactive';
      updateCustomer.mutate({
        ...customer,
        isActive: newIsActive,
        status: newStatus,
      }, {
        onSuccess: () => {
          toast.success(newIsActive ? "Customer enabled successfully" : "Customer disabled successfully");
        },
        onError: (error: any) => {
          const errorMessage = error?.message || error?.info?.message || "Failed to update customer status";
          toast.error(errorMessage);
        },
      });
    }
  };

  // Pagination logic
  const total = customers.length;
  const paginatedCustomers = customers.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full mx-auto">
      {isLoading ? (
        <Loader />
      ) : (
        <CustomerTable
          customers={paginatedCustomers}
          onAdd={handleAdd}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={size => { setPageSize(size); setPage(1); }}
        />
      )}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-[400px] overflow-y-auto">
          {sheetMode === 'view' && editingCustomer ? (
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
              <div className="mb-2"><b>Name:</b> {editingCustomer.name}</div>
              <div className="mb-2"><b>Phone:</b> {editingCustomer.phone}</div>
              <div className="mb-2"><b>Email:</b> {editingCustomer.email}</div>
              <button className="mt-4 text-blue-600 underline" onClick={() => setSheetOpen(false)}>Close</button>
            </div>
          ) : (
            <AddCustomerForm
              onSubmit={(data) => handleFormSubmit({
                id: editingCustomer?.id ?? '',
                ...data,
                email: data.email || '',
                isActive: data.status === 'Active',
              })}
              onCancel={() => setSheetOpen(false)}
              defaultValues={sheetMode === 'edit' && editingCustomer ? {
                name: editingCustomer.name,
                phone: editingCustomer.phone,
                email: editingCustomer.email,
                status: editingCustomer.isActive ? 'Active' : 'Inactive',
              } : undefined}
            />
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to delete <strong>{customerToDelete?.name}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Customers;
