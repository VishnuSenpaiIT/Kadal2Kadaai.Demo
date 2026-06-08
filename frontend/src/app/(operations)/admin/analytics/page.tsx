export default function EnterpriseAnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Enterprise Analytics</h1>
      <p className="text-muted-foreground">Platform-wide business intelligence and reporting.</p>
      
      <div className="grid gap-4 md:grid-cols-4">
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Monthly Revenue</h3>
          <p className="text-3xl font-bold text-primary">₹1,45,000</p>
          <p className="text-sm text-green-600 mt-1">+12% from last month</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-primary">342</p>
          <p className="text-sm text-muted-foreground mt-1">This month</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Active Sellers</h3>
          <p className="text-3xl font-bold text-primary">45</p>
          <p className="text-sm text-muted-foreground mt-1">Across 12 regions</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Refund Rate</h3>
          <p className="text-3xl font-bold text-green-600">1.2%</p>
          <p className="text-sm text-muted-foreground mt-1">Well below 5% target</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-card rounded-xl border shadow-sm min-h-[300px]">
          <h3 className="font-semibold text-lg mb-4">Top Categories</h3>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Category pie chart placeholder
          </div>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm min-h-[300px]">
          <h3 className="font-semibold text-lg mb-4">Revenue Trend</h3>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Revenue line chart placeholder
          </div>
        </div>
      </div>
    </div>
  );
}
