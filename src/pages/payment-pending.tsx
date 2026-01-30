
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useGetPaymentPending } from "@/service/api";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

export default function PaymentPending() {
  const { data = [], isLoading } = useGetPaymentPending();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Payment Pending</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Accordion.Root type="multiple" className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Pending Amount</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((customer: any) => (
                <Accordion.Item value={String(customer.customerId)} key={customer.customerId} asChild>
                  <>
                    <TableRow className="cursor-pointer">
                      <TableCell className="font-medium">{customer.customerName}</TableCell>
                      <TableCell className="text-blue-600 font-semibold">₹{customer.totalAmountToBeReceived}</TableCell>
                      <TableCell className="w-8">
                        <Accordion.Trigger asChild>
                          <button className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition group">
                            <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </button>
                        </Accordion.Trigger>
                      </TableCell>
                    </TableRow>
                    <Accordion.Content asChild>
                      <TableRow>
                        <TableCell colSpan={3} className="p-0 bg-gray-50">
                          <div className="p-4">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Entry ID</TableHead>
                                  <TableHead>Estimate</TableHead>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {customer.pendingEntries.map((entry: any) => (
                                  <TableRow key={entry.entryId}>
                                    <TableCell>{entry.entryId}</TableCell>
                                    <TableCell>₹{entry.estimate}</TableCell>
                                    <TableCell>{entry.date}</TableCell>
                                    <TableCell>{entry.status}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    </Accordion.Content>
                  </>
                </Accordion.Item>
              ))}
            </TableBody>
          </Table>
        </Accordion.Root>
      )}
    </div>
  );
}


