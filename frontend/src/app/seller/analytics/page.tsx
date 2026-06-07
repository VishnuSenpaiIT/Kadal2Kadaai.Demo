export default function SellerAnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Shop Analytics</h1>
      <p className="text-muted-foreground">Track your revenue, orders, and best-selling catches.</p>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">My Revenue</h3>
          <p className="text-3xl font-bold text-primary">₹45,000</p>
          <p className="text-sm text-green-600 mt-1">This month</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Orders Fulfilled</h3>
          <p className="text-3xl font-bold text-primary">120</p>
          <p className="text-sm text-muted-foreground mt-1">This month</p>
        </div>
        <div className="p-6 bg-card rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Inventory Alerts</h3>
          <p className="text-3xl font-bold text-orange-500">2</p>
          <p className="text-sm text-muted-foreground mt-1">Products low on stock</p>
        </div>
      </div>
      
      <div className="p-6 bg-card rounded-xl border shadow-sm min-h-[300px]">
        <h3 className="font-semibold text-lg mb-4">Best Sellers</h3>
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Top products table placeholder
        </div>
      </div>
    </div>
  );
}
