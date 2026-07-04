$latest = \App\Models\Order::latest()->first();
if ($latest) {
    \App\Models\Order::where('id', '!=', $latest->id)->delete();
    echo "Deleted old orders.\n";
} else {
    echo "No orders found.\n";
}
