
import React, { useState } from "react";
import { Sheet, SheetContent } from "../components/ui/sheet";
import { CustomerTable } from "../components/Customer/customer-table";
import type { Customer } from "../components/Customer/customer-table";
import { AddCustomerForm } from "../components/Customer/add-customer-form";

const initialCustomers: Customer[] = [
  { name: "John Doe", phone: "9876543210", email: "john@example.com", status: "Active" },
  { name: "Jane Smith", phone: "9123456780", email: "jane@example.com", status: "Inactive" },
  { name: "Alice Brown", phone: "9988776655", email: "alice@example.com", status: "Active" },
];

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [sheetMode, setSheetMode] = useState<'add' | 'edit' | 'view'>('add');

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
    setCustomers((prev) => prev.filter((c) => c !== customer));
  };

  const handleFormSubmit = (data: Customer) => {
    if (sheetMode === 'add') {
      setCustomers((prev) => [...prev, data]);
    } else if (sheetMode === 'edit' && editingCustomer) {
      setCustomers((prev) => prev.map((c) => (c === editingCustomer ? data : c)));
    }
    setSheetOpen(false);
  };

  const handleToggle = () => {
  }

  // Pagination logic
  const total = customers.length;
  const paginatedCustomers = customers.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
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
      />
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
              onSubmit={handleFormSubmit}
              onCancel={() => setSheetOpen(false)}
              defaultValues={sheetMode === 'edit' && editingCustomer ? editingCustomer : undefined}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Customers;
