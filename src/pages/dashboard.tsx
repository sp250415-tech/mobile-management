import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Dummy data for demonstration
const entries = [
  { date: "2025-08-01" },
  { date: "2025-08-01" },
  { date: "2025-08-02" },
  { date: "2025-08-03" },
  { date: "2025-08-03" },
  { date: "2025-08-03" },
];
const customers = ["Customer 1", "Customer 2", "Customer 3"];

// Prepare chart data
// const dateCounts = entries.reduce<Record<string, number>>((acc, entry) => {
//   acc[entry.date] = (acc[entry.date] || 0) + 1;
//   return acc;
// }, {});
// const chartLabels = Object.keys(dateCounts);
// const chartData = Object.values(dateCounts);

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{entries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Entries by Date</CardTitle>
          </CardHeader>
          <CardContent>
            
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-4 justify-center mt-8">
        <Button onClick={() => navigate("/entries")}>Entries</Button>
        <Button onClick={() => navigate("/customers")}>Customers</Button>
        <Button onClick={() => navigate("/devices")}>Devices</Button>
      </div>
    </div>
  );
}
