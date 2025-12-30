import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useGetPaymentPending } from "@/service/api";

export default function PaymentPending() {
  const { data = [], isLoading } = useGetPaymentPending();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Payment Pending</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        data.map((customer: any) => (
          <Card key={customer.customerId} className="mb-6">
            <CardHeader>
              <CardTitle>
                {customer.customerName} &rarr; <span className="text-blue-600 font-semibold">₹{customer.totalAmountToBeReceived}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
