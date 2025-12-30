import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetCustomers } from "@/service/api";
import { useGetEntriesStats } from "@/service/api";
// Prepare chart data
// const dateCounts = entries.reduce<Record<string, number>>((acc, entry) => {
//   acc[entry.date] = (acc[entry.date] || 0) + 1;
//   return acc;
// }, {});
// const chartLabels = Object.keys(dateCounts);
// const chartData = Object.values(dateCounts);

export default function Dashboard() {
  const { data: customers = [], isLoading: loadingCustomers } = useGetCustomers();

  // Get current year-month in YYYY-MM format
  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const { data: stats = {}, isLoading: loadingStats } = useGetEntriesStats(yearMonth);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loadingStats ? "..." : stats.totalEntries ?? 0}
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
            <CardTitle>Delivered (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loadingStats ? "..." : stats.deliveredCount ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Returns (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loadingStats ? "..." : stats.returnsCount ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
