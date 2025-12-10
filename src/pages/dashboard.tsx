import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetEntries, useGetCustomers } from "@/service/api";
// Prepare chart data
// const dateCounts = entries.reduce<Record<string, number>>((acc, entry) => {
//   acc[entry.date] = (acc[entry.date] || 0) + 1;
//   return acc;
// }, {});
// const chartLabels = Object.keys(dateCounts);
// const chartData = Object.values(dateCounts);

export default function Dashboard() {
  const { data: entries = [], isLoading: loadingEntries } = useGetEntries();
  const { data: customers = [], isLoading: loadingCustomers } = useGetCustomers();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loadingEntries ? "..." : entries.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loadingCustomers ? "..." : customers.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Entries by Date</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>
    </div>
  );
}
