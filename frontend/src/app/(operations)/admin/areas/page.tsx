'use client';

import React, { useState } from 'react';
import { 
  useAdminAreas, 
  useCreateArea, 
  useUpdateArea, 
  useDeleteArea,
  Area,
  fetchPlacesAutocomplete
} from '@/shared/api/hooks/useAdminAreas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Loader2, 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  MapPin, 
  X, 
  IndianRupee, 
  TrendingUp, 
  Map 
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminAreasPage() {
  const { data: areas = [], isLoading } = useAdminAreas();
  const createArea = useCreateArea();
  const updateArea = useUpdateArea();
  const deleteArea = useDeleteArea();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingArea, setEditingArea] = useState<Area | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [shippingPrice, setShippingPrice] = useState('');
  
  // Autocomplete State
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);

  React.useEffect(() => {
    if (!isSuggestionsOpen || !name.trim() || name.length < 2) {
      setSuggestions([]);
      return;
    }
    
    const timer = setTimeout(async () => {
      setIsFetchingSuggestions(true);
      try {
        const results = await fetchPlacesAutocomplete(name);
        setSuggestions(results);
      } catch (e) {
        console.error(e);
      } finally {
        setIsFetchingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [name, isSuggestionsOpen]);

  const handleEditClick = (area: Area) => {
    setEditingArea(area);
    setName(area.name);
    setShippingPrice(area.shipping_price.toString());
  };

  const handleCancelEdit = () => {
    setEditingArea(null);
    setName('');
    setShippingPrice('');
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? Customers from this area will revert to default flat-rate shipping.`)) return;
    
    try {
      await deleteArea.mutateAsync(id);
      toast.success(`Area "${name}" deleted successfully.`);
      if (editingArea?.id === id) {
        handleCancelEdit();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete area.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a valid area name.');
      return;
    }
    
    const priceNum = parseFloat(shippingPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error('Please enter a valid non-negative shipping price.');
      return;
    }

    const payload = {
      name: name.trim(),
      shipping_price: priceNum
    };

    try {
      if (editingArea) {
        await updateArea.mutateAsync({ id: editingArea.id, payload });
        toast.success(`Area "${payload.name}" updated successfully.`);
      } else {
        await createArea.mutateAsync(payload);
        toast.success(`Area "${payload.name}" added successfully.`);
      }
      handleCancelEdit();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Operation failed.');
    }
  };

  const filteredAreas = areas.filter((area) => 
    area.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 max-w-6xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary-900 tracking-tight flex items-center gap-2">
            <Map className="text-primary-600 w-8 h-8" />
            Area Master
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage serviceable areas inside Chennai and set specific shipping fees for each locality.
          </p>
        </div>
        
        {/* Quick Stats Banner */}
        <div className="bg-slate-50 border rounded-xl px-5 py-3 flex items-center gap-4 shadow-sm w-full md:w-auto">
          <div className="bg-primary-100 p-2.5 rounded-lg text-primary-700">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xs font-bold text-slate-500 uppercase tracking-wider">Total Serviceable Areas</div>
            <div className="text-xl font-extrabold text-slate-900 font-heading">{areas.length} Chennai Localities</div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT/MID COLUMN: Areas List (takes 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            {/* Search Filter Bar */}
            <div className="p-4 border-b flex items-center gap-4 bg-slate-50">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                <Input
                  placeholder="Search localities in Chennai (e.g. Anna Nagar)..."
                  className="pl-10 h-11 rounded-xl bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* List Body */}
            {isLoading ? (
              <div className="p-16 flex flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary-600" />
                <p className="font-medium">Loading areas & shipping schedules...</p>
              </div>
            ) : filteredAreas.length === 0 ? (
              <div className="p-16 text-center text-muted-foreground space-y-2">
                <MapPin className="w-12 h-12 mx-auto text-slate-300 opacity-80" />
                <p className="font-semibold text-lg">No Chennai localities found</p>
                <p className="text-sm">Try searching another location or add a new locality in the right-hand panel.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100/80 text-xs uppercase text-slate-600 font-bold border-b">
                    <tr>
                      <th className="px-6 py-4">Locality Name</th>
                      <th className="px-6 py-4">Location Tier</th>
                      <th className="px-6 py-4 text-center">Shipping Price</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAreas.map((area) => (
                      <tr key={area.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="bg-primary-50 text-primary-700 p-1.5 rounded-lg">
                              <MapPin className="w-4 h-4" />
                            </span>
                            <span className="font-bold text-slate-900 text-base">{area.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                            Chennai Local
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-black text-sm px-3 py-1.5 rounded-xl border border-emerald-100">
                            <IndianRupee className="w-3.5 h-3.5" />
                            {area.shipping_price.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-9 w-9 hover:bg-primary-50 rounded-lg"
                              onClick={() => handleEditClick(area)}
                            >
                              <Edit2 className="w-4 h-4 text-primary-600" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-9 w-9 hover:bg-red-50 text-destructive rounded-lg"
                              onClick={() => handleDelete(area.id, area.name)} 
                              disabled={deleteArea.isPending}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Create / Edit Form Card (takes 1/3) */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-2xl shadow-md p-6 space-y-6 sticky top-24">
            <div className="flex justify-between items-center pb-3 border-b">
              <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
                {editingArea ? (
                  <>
                    <Edit2 className="w-5 h-5 text-amber-500" />
                    Edit Locality
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-primary-600" />
                    Add Chennai Locality
                  </>
                )}
              </h2>
              {editingArea && (
                <button 
                  onClick={handleCancelEdit}
                  className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="area_name" className="text-slate-700 font-bold">Locality / Area Name *</Label>
                <div className="relative">
                  <Input
                    id="area_name"
                    required
                    placeholder="e.g. Anna Nagar, Adyar"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setIsSuggestionsOpen(true);
                    }}
                    onFocus={() => {
                      if (name.trim().length >= 2) setIsSuggestionsOpen(true);
                    }}
                    onBlur={() => {
                      // Delay to allow click on suggestion
                      setTimeout(() => setIsSuggestionsOpen(false), 200);
                    }}
                    className="rounded-xl h-11 w-full"
                    autoComplete="off"
                  />
                  {isSuggestionsOpen && (name.length >= 2) && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto">
                      {isFetchingSuggestions ? (
                        <div className="p-3 text-sm text-slate-500 text-center flex justify-center items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Fetching suggestions...
                        </div>
                      ) : suggestions.length > 0 ? (
                        <ul className="py-1 divide-y divide-slate-100">
                          {suggestions.map((s, idx) => {
                             const mainText = s.structured_formatting?.main_text || s.description;
                             return (
                               <li 
                                 key={idx}
                                 onClick={() => {
                                   setName(mainText);
                                   setIsSuggestionsOpen(false);
                                 }}
                                 className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                               >
                                 <div className="font-bold text-slate-900 text-sm">{mainText}</div>
                                 {s.structured_formatting?.secondary_text && (
                                   <div className="text-xs text-slate-500 truncate mt-0.5">{s.structured_formatting.secondary_text}</div>
                                 )}
                               </li>
                             );
                          })}
                        </ul>
                      ) : null}
                    </div>
                  )}
                </div>
                <p className="text-2xs text-muted-foreground">
                  Must exactly match the Area/Locality typed or picked by consumers at checkout (case-insensitive).
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipping_price" className="text-slate-700 font-bold">Shipping Cost (₹) *</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-bold">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  <Input
                    id="shipping_price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="e.g. 10.00"
                    value={shippingPrice}
                    onChange={(e) => setShippingPrice(e.target.value)}
                    className="pl-9 rounded-xl h-11"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                {editingArea && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancelEdit}
                    className="flex-1 rounded-xl h-11"
                  >
                    Cancel
                  </Button>
                )}
                <Button 
                  type="submit" 
                  disabled={createArea.isPending || updateArea.isPending}
                  className={`flex-1 rounded-xl h-11 text-white font-bold ${
                    editingArea ? 'bg-amber-600 hover:bg-amber-700' : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  {createArea.isPending || updateArea.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : null}
                  {editingArea ? 'Update Area' : 'Save Area'}
                </Button>
              </div>
            </form>

            {!editingArea && (
              <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-200 text-xs text-slate-500 space-y-2">
                <div className="font-bold text-slate-700 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-primary-600" />
                  How it works:
                </div>
                <p>
                  Once you register a Chennai area (e.g. <strong>Anna Nagar</strong>) with a shipping price (e.g. <strong>₹10.00</strong>), any customer who selects an address containing <strong>"Anna Nagar"</strong> as their locality will pay exactly <strong>₹10.00</strong> for delivery, listed separately at checkout.
                </p>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
