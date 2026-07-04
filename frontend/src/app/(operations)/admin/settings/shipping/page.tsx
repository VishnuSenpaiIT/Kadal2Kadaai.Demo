'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Loader2,
  Anchor,
  Compass,
  Settings,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertTriangle,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Import hooks
import {
  useAdminHarbours,
  useCreateHarbour,
  useUpdateHarbour,
  useDeleteHarbour,
  Harbour
} from '@/shared/api/hooks/useAdminHarbours';
import {
  useAdminShippingRanges,
  useCreateShippingRange,
  useUpdateShippingRange,
  useDeleteShippingRange,
  ShippingRange
} from '@/shared/api/hooks/useAdminShippingRanges';
import {
  useAdminShippingSettings,
  useUpdateAdminShippingSettings
} from '@/shared/api/hooks/useAdminShippingSettings';

// Location picker component
import HarbourLocationPicker from '@/components/domain/harbour/HarbourLocationPicker';

export default function ShippingSettingsPage() {
  const { data: harbours, isLoading: loadingHarbours } = useAdminHarbours();
  const { data: ranges, isLoading: loadingRanges } = useAdminShippingRanges();
  const { data: settings, isLoading: loadingSettings } = useAdminShippingSettings();

  const createHarbour = useCreateHarbour();
  const updateHarbour = useUpdateHarbour();
  const deleteHarbour = useDeleteHarbour();

  const createRange = useCreateShippingRange();
  const updateRange = useUpdateShippingRange();
  const deleteRange = useDeleteShippingRange();

  const updateSettings = useUpdateAdminShippingSettings();

  // Active outer tab
  const [activeTab, setActiveTab] = useState<'ranges' | 'harbours' | 'maps'>('ranges');

  // Harbour Dialog state
  const [harbourModalOpen, setHarbourModalOpen] = useState(false);
  const [editingHarbour, setEditingHarbour] = useState<Harbour | null>(null);
  const [harbourForm, setHarbourForm] = useState({
    harbour_name: '',
    harbour_code: '',
    description: '',
    address_line_1: '',
    address_line_2: '',
    area_locality: '',
    landmark: '',
    city: '',
    district: '',
    state: '',
    country: 'India',
    pincode: '',
    latitude: '' as string | number,
    longitude: '' as string | number,
    google_place_id: '',
    google_plus_code: '',
    timezone: '',
    status: true,
    is_default: false,
  });

  // Shipping Range Dialog state
  const [rangeModalOpen, setRangeModalOpen] = useState(false);
  const [editingRange, setEditingRange] = useState<ShippingRange | null>(null);
  const [rangeForm, setRangeForm] = useState({
    from_distance: '',
    to_distance: '',
    shipping_price: '',
    status: true,
  });

  // Google Maps settings state
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeyInitialized, setApiKeyInitialized] = useState(false);

  // Initialize Maps key input from settings once loaded
  React.useEffect(() => {
    if (settings && !apiKeyInitialized) {
      setApiKeyInput(settings.google_maps_api_key || '');
      setApiKeyInitialized(true);
    }
  }, [settings, apiKeyInitialized]);

  // Open Harbour Dialog
  const handleOpenHarbourModal = (harbour?: Harbour) => {
    if (harbour) {
      setEditingHarbour(harbour);
      setHarbourForm({
        harbour_name: harbour.harbour_name,
        harbour_code: harbour.harbour_code || '',
        description: harbour.description || '',
        address_line_1: harbour.address_line_1 || '',
        address_line_2: harbour.address_line_2 || '',
        area_locality: harbour.area_locality || '',
        landmark: harbour.landmark || '',
        city: harbour.city || '',
        district: harbour.district || '',
        state: harbour.state || '',
        country: harbour.country || 'India',
        pincode: harbour.pincode || '',
        latitude: harbour.latitude || '',
        longitude: harbour.longitude || '',
        google_place_id: harbour.google_place_id || '',
        google_plus_code: harbour.google_plus_code || '',
        timezone: harbour.timezone || '',
        status: harbour.status,
        is_default: harbour.is_default,
      });
    } else {
      setEditingHarbour(null);
      setHarbourForm({
        harbour_name: '',
        harbour_code: '',
        description: '',
        address_line_1: '',
        address_line_2: '',
        area_locality: '',
        landmark: '',
        city: '',
        district: '',
        state: '',
        country: 'India',
        pincode: '',
        latitude: '',
        longitude: '',
        google_place_id: '',
        google_plus_code: '',
        timezone: '',
        status: true,
        is_default: false,
      });
    }
    setHarbourModalOpen(true);
  };

  // Save Harbour
  const handleSaveHarbour = (e: React.FormEvent) => {
    e.preventDefault();

    if (!harbourForm.harbour_name.trim()) {
      toast.error('Harbour Name is required');
      return;
    }
    if (!harbourForm.address_line_1.trim()) {
      toast.error('Address Line 1 is required');
      return;
    }
    if (!harbourForm.area_locality.trim()) {
      toast.error('Area/Locality is required');
      return;
    }
    if (!harbourForm.city.trim()) {
      toast.error('City is required');
      return;
    }
    if (!harbourForm.district.trim()) {
      toast.error('District is required');
      return;
    }
    if (!harbourForm.state.trim()) {
      toast.error('State is required');
      return;
    }
    if (!harbourForm.pincode.trim()) {
      toast.error('Pincode is required');
      return;
    }
    if (harbourForm.latitude === '' || harbourForm.longitude === '') {
      toast.error('Latitude & Longitude coordinates are required. Drag marker or search address to fill.');
      return;
    }

    const payload = {
      harbour_name: harbourForm.harbour_name,
      harbour_code: harbourForm.harbour_code || null,
      description: harbourForm.description || null,
      address_line_1: harbourForm.address_line_1,
      address_line_2: harbourForm.address_line_2 || null,
      area_locality: harbourForm.area_locality,
      landmark: harbourForm.landmark || null,
      city: harbourForm.city,
      district: harbourForm.district,
      state: harbourForm.state,
      country: harbourForm.country || 'India',
      pincode: harbourForm.pincode,
      latitude: Number(harbourForm.latitude),
      longitude: Number(harbourForm.longitude),
      google_place_id: harbourForm.google_place_id || null,
      google_plus_code: harbourForm.google_plus_code || null,
      timezone: harbourForm.timezone || null,
      status: harbourForm.status,
      is_default: harbourForm.is_default,
    };

    if (editingHarbour) {
      updateHarbour.mutate(
        { id: editingHarbour.id, payload },
        {
          onSuccess: () => {
            toast.success('Harbour updated successfully');
            setHarbourModalOpen(false);
          },
          onError: (err: any) => {
            const validationErrors = err.response?.data?.errors;
            if (validationErrors) {
              const messages = Object.values(validationErrors).flat().join(' ');
              toast.error(messages);
            } else {
              toast.error(err.response?.data?.message || 'Failed to update harbour');
            }
          },
        }
      );
    } else {
      createHarbour.mutate(payload, {
        onSuccess: () => {
          toast.success('Harbour created successfully');
          setHarbourModalOpen(false);
        },
        onError: (err: any) => {
          const validationErrors = err.response?.data?.errors;
          if (validationErrors) {
            const messages = Object.values(validationErrors).flat().join(' ');
            toast.error(messages);
          } else {
            toast.error(err.response?.data?.message || 'Failed to create harbour');
          }
        },
      });
    }
  };

  // Toggle Harbour status directly
  const handleToggleHarbourStatus = (harbour: Harbour) => {
    updateHarbour.mutate(
      {
        id: harbour.id,
        payload: { status: !harbour.status },
      },
      {
        onSuccess: () => {
          toast.success(`Harbour ${!harbour.status ? 'enabled' : 'disabled'} successfully`);
        },
        onError: (err: any) => {
          toast.error(err.message || 'Failed to update harbour status');
        },
      }
    );
  };

  // Set default Harbour directly
  const handleSetDefaultHarbour = (harbour: Harbour) => {
    updateHarbour.mutate(
      {
        id: harbour.id,
        payload: { is_default: true },
      },
      {
        onSuccess: () => {
          toast.success(`Set ${harbour.harbour_name} as the default harbour`);
        },
        onError: (err: any) => {
          toast.error(err.message || 'Failed to set default harbour');
        },
      }
    );
  };

  // Delete Harbour
  const handleDeleteHarbour = (harbour: Harbour) => {
    if (window.confirm(`Are you sure you want to delete harbour "${harbour.harbour_name}"?`)) {
      deleteHarbour.mutate(harbour.id, {
        onSuccess: () => {
          toast.success('Harbour deleted successfully');
        },
        onError: (err: any) => {
          toast.error(err.message || 'Failed to delete harbour');
        },
      });
    }
  };

  // Open Range Dialog
  const handleOpenRangeModal = (range?: ShippingRange) => {
    if (range) {
      setEditingRange(range);
      setRangeForm({
        from_distance: String(range.from_distance),
        to_distance: String(range.to_distance),
        shipping_price: String(range.shipping_price),
        status: range.status,
      });
    } else {
      setEditingRange(null);
      setRangeForm({
        from_distance: '',
        to_distance: '',
        shipping_price: '',
        status: true,
      });
    }
    setRangeModalOpen(true);
  };

  // Save Shipping Range
  const handleSaveRange = (e: React.FormEvent) => {
    e.preventDefault();

    const fromVal = Number(rangeForm.from_distance);
    const toVal = Number(rangeForm.to_distance);
    const priceVal = Number(rangeForm.shipping_price);

    if (isNaN(fromVal) || fromVal < 0) {
      toast.error('From Distance must be a number greater than or equal to 0');
      return;
    }
    if (isNaN(toVal) || toVal <= fromVal) {
      toast.error('To Distance must be greater than From Distance');
      return;
    }
    if (isNaN(priceVal) || priceVal < 0) {
      toast.error('Price must be a number greater than or equal to 0');
      return;
    }

    const payload = {
      from_distance: fromVal,
      to_distance: toVal,
      shipping_price: priceVal,
      status: rangeForm.status,
    };

    if (editingRange) {
      updateRange.mutate(
        { id: editingRange.id, payload },
        {
          onSuccess: () => {
            toast.success('Shipping range updated successfully');
            setRangeModalOpen(false);
          },
          onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to update shipping range');
          },
        }
      );
    } else {
      createRange.mutate(payload, {
        onSuccess: () => {
          toast.success('Shipping range created successfully');
          setRangeModalOpen(false);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || 'Failed to create shipping range');
        },
      });
    }
  };

  // Toggle Range status directly
  const handleToggleRangeStatus = (range: ShippingRange) => {
    updateRange.mutate(
      {
        id: range.id,
        payload: { status: !range.status },
      },
      {
        onSuccess: () => {
          toast.success(`Shipping range ${!range.status ? 'enabled' : 'disabled'} successfully`);
        },
        onError: (err: any) => {
          toast.error(err.message || 'Failed to update status');
        },
      }
    );
  };

  // Delete Shipping Range
  const handleDeleteRange = (range: ShippingRange) => {
    if (window.confirm(`Are you sure you want to delete distance range ${range.from_distance}km - ${range.to_distance}km?`)) {
      deleteRange.mutate(range.id, {
        onSuccess: () => {
          toast.success('Shipping range deleted successfully');
        },
        onError: (err: any) => {
          toast.error(err.message || 'Failed to delete range');
        },
      });
    }
  };

  // Save Maps API settings
  const handleSaveMapsSettings = () => {
    if (!apiKeyInput.trim()) {
      toast.error('API Key cannot be empty');
      return;
    }

    updateSettings.mutate(
      { google_maps_api_key: apiKeyInput },
      {
        onSuccess: () => {
          toast.success('Google Maps settings updated successfully');
        },
        onError: (err: any) => {
          toast.error(err.message || 'Failed to update settings');
        },
      }
    );
  };

  // Render loading state for settings
  const showLoading = loadingHarbours || loadingRanges || loadingSettings;

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground tracking-tight flex items-center gap-2">
            <Anchor className="h-8 w-8 text-primary-900" />
            Shipping Module Settings
          </h1>
          <p className="text-muted-foreground mt-1">Configure distance rates, shipping hubs, and map integrations.</p>
        </div>
      </div>

      {/* Sub-navigation Tabs (General vs Shipping) */}
      <div className="flex border-b border-border/80">
        <Link href="/admin/settings" className="px-6 py-3 font-semibold text-muted-foreground hover:text-foreground transition-all relative border-b-2 border-transparent">
          General Settings
        </Link>
        <button className="px-6 py-3 font-semibold text-primary border-b-2 border-primary relative">
          Shipping Settings
        </button>
      </div>

      {showLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
          <p className="text-muted-foreground font-medium">Loading shipping module configurations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Inner Navigation Sidebar */}
          <div className="lg:col-span-1 bg-card rounded-xl border p-4 space-y-1">
            <button
              onClick={() => setActiveTab('ranges')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'ranges'
                  ? 'bg-primary-900 text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <Compass className="h-4.5 w-4.5" />
              Distance Rates
            </button>
            <button
              onClick={() => setActiveTab('harbours')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'harbours'
                  ? 'bg-primary-900 text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <Anchor className="h-4.5 w-4.5" />
              Harbour Management
            </button>
            <button
              onClick={() => setActiveTab('maps')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'maps'
                  ? 'bg-primary-900 text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <Globe className="h-4.5 w-4.5" />
              Google Maps Config
            </button>
          </div>

          {/* Inner Tab Panels */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* PANEL: Distance Range Management */}
            {activeTab === 'ranges' && (
              <div className="bg-card rounded-xl border shadow-sm p-6">
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Shipping Distance Management</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Define shipping price tiers based on customer distance from harbour.</p>
                  </div>
                  <Button onClick={() => handleOpenRangeModal()} className="bg-primary-900 hover:bg-primary-800">
                    <Plus className="h-4 w-4 mr-1.5" /> Add Range
                  </Button>
                </div>

                {!ranges || ranges.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-border/80 rounded-xl bg-muted/5">
                    <Compass className="h-10 w-10 text-muted-foreground/45 mx-auto mb-3" />
                    <p className="font-semibold text-muted-foreground">No shipping distance ranges defined.</p>
                    <p className="text-xs text-muted-foreground/80 mt-1 max-w-sm mx-auto">
                      Add distance-based price rules (e.g. 0-5 km = ₹30) to charge customers correctly at checkout.
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-xl overflow-hidden bg-background">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted/65 text-muted-foreground font-bold border-b">
                        <tr>
                          <th className="px-4 py-3">From Distance (km)</th>
                          <th className="px-4 py-3">To Distance (km)</th>
                          <th className="px-4 py-3">Shipping Price</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {ranges.map((range) => (
                          <tr key={range.id} className="hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-3 font-semibold">{range.from_distance} km</td>
                            <td className="px-4 py-3 font-semibold">{range.to_distance} km</td>
                            <td className="px-4 py-3 font-bold text-primary">₹{range.shipping_price}</td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleToggleRangeStatus(range)}
                                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                                  range.status
                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-border'
                                }`}
                              >
                                {range.status ? 'Active' : 'Inactive'}
                              </button>
                            </td>
                            <td className="px-4 py-3 text-right space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenRangeModal(range)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit2 className="h-4.5 w-4.5 text-muted-foreground hover:text-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteRange(range)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4.5 w-4.5 text-error-500 hover:text-error-600 hover:bg-error-50" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* PANEL: Harbour Management */}
            {activeTab === 'harbours' && (
              <div className="bg-card rounded-xl border shadow-sm p-6">
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Harbour Management</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Manage operational ports/harbours from which shipping originates.</p>
                  </div>
                  <Button onClick={() => handleOpenHarbourModal()} className="bg-primary-900 hover:bg-primary-800">
                    <Plus className="h-4 w-4 mr-1.5" /> Add Harbour
                  </Button>
                </div>

                {!harbours || harbours.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-border/80 rounded-xl bg-muted/5">
                    <Anchor className="h-10 w-10 text-muted-foreground/45 mx-auto mb-3" />
                    <p className="font-semibold text-muted-foreground">No shipping harbours registered.</p>
                    <p className="text-xs text-muted-foreground/80 mt-1 max-w-sm mx-auto">
                      Add a shipping harbour with geographic coordinates to enable Google Maps distance matrix lookup during checkout.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-5">
                    {harbours.map((harbour) => (
                      <div
                        key={harbour.id}
                        className={`flex flex-col lg:flex-row lg:items-start justify-between p-6 border rounded-2xl gap-6 bg-background transition-all ${
                          harbour.is_default
                            ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm'
                            : 'border-border/60 hover:border-border'
                        }`}
                      >
                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-lg text-foreground">{harbour.harbour_name}</h3>
                            {harbour.harbour_code && (
                              <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs font-mono font-bold">
                                {harbour.harbour_code}
                              </span>
                            )}
                            {harbour.is_default && (
                              <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold bg-primary text-white uppercase tracking-wider">
                                Default
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded-full text-2xs font-extrabold border ${
                              harbour.status 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-muted text-muted-foreground border-border'
                            }`}>
                              {harbour.status ? 'Active' : 'Inactive'}
                            </span>
                          </div>

                          {/* Full Address details */}
                          <div className="space-y-1 text-sm text-foreground/90">
                            <p className="leading-relaxed">
                              <span className="font-semibold text-muted-foreground">Address:</span>{' '}
                              {harbour.address_line_1}
                              {harbour.address_line_2 ? `, ${harbour.address_line_2}` : ''}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {harbour.area_locality && <span>{harbour.area_locality}, </span>}
                              {harbour.city && <span>{harbour.city}, </span>}
                              {harbour.district && <span>District: {harbour.district}, </span>}
                              {harbour.state && <span>{harbour.state}, </span>}
                              {harbour.country && <span>{harbour.country}</span>}
                              {harbour.pincode && <span className="font-mono font-bold ml-1">({harbour.pincode})</span>}
                            </p>
                            {harbour.landmark && (
                              <p className="text-xs italic text-muted-foreground/90">
                                <span className="font-semibold not-italic">Landmark:</span> {harbour.landmark}
                              </p>
                            )}
                          </div>

                          {/* Live coordinates and Google identifiers */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs font-semibold text-muted-foreground/80 border-t border-dashed pt-3 mt-2">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span>Coordinates: {harbour.latitude?.toFixed(6) || 'N/A'}, {harbour.longitude?.toFixed(6) || 'N/A'}</span>
                            </div>

                            {harbour.google_place_id && (
                              <div className="flex items-center gap-1.5 font-mono text-2xs truncate max-w-[280px]">
                                <Globe className="w-3.5 h-3.5 text-blue-500" />
                                <span>Place ID: {harbour.google_place_id}</span>
                              </div>
                            )}

                            {harbour.google_plus_code && (
                              <div className="flex items-center gap-1.5 font-mono text-2xs">
                                <span>➕ Plus Code: {harbour.google_plus_code}</span>
                              </div>
                            )}

                            {harbour.timezone && (
                              <div className="flex items-center gap-1.5">
                                <span>🌐 Timezone: {harbour.timezone}</span>
                              </div>
                            )}
                          </div>

                          {/* Google Maps Static Preview */}
                          {settings?.google_maps_api_key && harbour.latitude && harbour.longitude && (
                            <div className="w-full h-36 relative rounded-xl overflow-hidden border border-border/70 mt-3 shadow-inner">
                              <img
                                src={`https://maps.googleapis.com/maps/api/staticmap?center=${harbour.latitude},${harbour.longitude}&zoom=14&size=600x200&markers=color:red%7C${harbour.latitude},${harbour.longitude}&key=${settings.google_maps_api_key}`}
                                alt="Harbour Google Map Location Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {harbour.description && (
                            <div className="bg-muted/30 text-xs p-3 rounded-lg border border-border/40 mt-3 text-muted-foreground leading-relaxed">
                              <span className="font-bold text-foreground/80 block mb-0.5">Description / Dock Instructions:</span>
                              {harbour.description}
                            </div>
                          )}

                          <div className="text-3xs text-muted-foreground/60 font-medium pt-1">
                            Last Updated: {harbour.updated_at ? new Date(harbour.updated_at).toLocaleString() : 'N/A'}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                          {/* Default Harbour Toggle */}
                          {!harbour.is_default ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetDefaultHarbour(harbour)}
                              className="text-xs font-semibold border-border hover:bg-muted"
                            >
                              Make Default
                            </Button>
                          ) : null}

                          {/* Status toggle */}
                          <button
                            onClick={() => handleToggleHarbourStatus(harbour)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                              harbour.status
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80 border-border'
                            }`}
                          >
                            {harbour.status ? 'Enabled' : 'Disabled'}
                          </button>

                          {/* Edit / Delete */}
                          <div className="flex gap-1.5 border-l pl-3 border-border/80">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenHarbourModal(harbour)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 className="h-4.5 w-4.5 text-muted-foreground hover:text-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteHarbour(harbour)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4.5 w-4.5 text-error-500 hover:text-error-600 hover:bg-error-50" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PANEL: Google Maps Configuration */}
            {activeTab === 'maps' && (
              <div className="bg-card rounded-xl border shadow-sm p-6">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-bold text-foreground">Google Maps API Settings</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Configure API credentials required for geolocation distance calculations.</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-muted/20 border rounded-2xl p-4 flex gap-3 text-sm text-muted-foreground leading-relaxed">
                    <Settings className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                    <div>
                      <span className="font-bold text-foreground block mb-1">How it is used:</span>
                      Google Maps Distance Matrix API calculates precise road transit distances from harbours to customer shipping addresses. 
                      The API key is securely encrypted on the database and processed only on the backend to avoid exposing credentials to client browsers.
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maps_api_key">Google Maps API Key</Label>
                    <div className="flex gap-3">
                      <Input
                        id="maps_api_key"
                        type="password"
                        placeholder={settings?.google_maps_api_key ? 'Saved Key (Masked)' : 'Enter Google Maps API Key'}
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        className="font-mono"
                      />
                      <Button
                        onClick={handleSaveMapsSettings}
                        disabled={updateSettings.isPending}
                        className="bg-primary-900 hover:bg-primary-800"
                      >
                        {updateSettings.isPending ? 'Saving...' : 'Save Key'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Only API Keys with access to the Geocoding API and Distance Matrix API are valid.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* DIALOG: Harbour Add/Edit Form */}
      <Dialog open={harbourModalOpen} onOpenChange={setHarbourModalOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingHarbour ? 'Edit Harbour Details' : 'Add New Harbour'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveHarbour} className="space-y-5 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="harbour_name">Harbour Name *</Label>
                <Input
                  id="harbour_name"
                  required
                  value={harbourForm.harbour_name}
                  onChange={(e) => setHarbourForm({ ...harbourForm, harbour_name: e.target.value })}
                  placeholder="e.g. Chennai Harbour Port"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="harbour_code">Harbour / Port Code (Optional)</Label>
                <Input
                  id="harbour_code"
                  value={harbourForm.harbour_code}
                  onChange={(e) => setHarbourForm({ ...harbourForm, harbour_code: e.target.value })}
                  placeholder="e.g. CHN-PORT"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="harbour_lat">Latitude *</Label>
                <Input
                  id="harbour_lat"
                  type="number"
                  step="0.000001"
                  min="-90"
                  max="90"
                  required
                  value={harbourForm.latitude}
                  onChange={(e) => setHarbourForm({ ...harbourForm, latitude: e.target.value })}
                  placeholder="e.g. 13.082700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="harbour_lng">Longitude *</Label>
                <Input
                  id="harbour_lng"
                  type="number"
                  step="0.000001"
                  min="-180"
                  max="180"
                  required
                  value={harbourForm.longitude}
                  onChange={(e) => setHarbourForm({ ...harbourForm, longitude: e.target.value })}
                  placeholder="e.g. 80.270700"
                />
              </div>
            </div>

            {/* Interactive Location Picker Map */}
            {settings?.google_maps_api_key ? (
              <HarbourLocationPicker
                apiKey={settings.google_maps_api_key}
                latitude={harbourForm.latitude !== '' ? Number(harbourForm.latitude) : null}
                longitude={harbourForm.longitude !== '' ? Number(harbourForm.longitude) : null}
                onChange={(lat, lng, addressDetails) => {
                  setHarbourForm({
                    ...harbourForm,
                    latitude: lat,
                    longitude: lng,
                    address_line_1: addressDetails.address_line_1 || harbourForm.address_line_1,
                    area_locality: addressDetails.area_locality || harbourForm.area_locality,
                    city: addressDetails.city || harbourForm.city,
                    district: addressDetails.district || harbourForm.district,
                    state: addressDetails.state || harbourForm.state,
                    country: addressDetails.country || harbourForm.country,
                    pincode: addressDetails.pincode || harbourForm.pincode,
                    google_place_id: addressDetails.google_place_id || harbourForm.google_place_id,
                    google_plus_code: addressDetails.google_plus_code || harbourForm.google_plus_code,
                  });
                }}
              />
            ) : (
              <div className="border border-amber-200 bg-amber-50 text-amber-800 rounded-xl p-4 text-sm flex gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <span className="font-semibold block mb-0.5">Interactive Map Disabled</span>
                  Configure a Google Maps API Key in Google Maps Config first to load the interactive map picker. 
                  You can still input coordinates manually above.
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="font-bold text-sm text-foreground/80 border-b pb-1">Complete Address Details (Autofilled from Map Pin)</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address_line_1">Address Line 1 *</Label>
                  <Input
                    id="address_line_1"
                    required
                    value={harbourForm.address_line_1}
                    onChange={(e) => setHarbourForm({ ...harbourForm, address_line_1: e.target.value })}
                    placeholder="e.g. Pier No. 4, Harbour Road"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                  <Input
                    id="address_line_2"
                    value={harbourForm.address_line_2}
                    onChange={(e) => setHarbourForm({ ...harbourForm, address_line_2: e.target.value })}
                    placeholder="e.g. Gate No. 2, Royapuram"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area_locality">Area / Locality *</Label>
                  <Input
                    id="area_locality"
                    required
                    value={harbourForm.area_locality}
                    onChange={(e) => setHarbourForm({ ...harbourForm, area_locality: e.target.value })}
                    placeholder="e.g. Kasimedu"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="landmark">Landmark (Optional)</Label>
                  <Input
                    id="landmark"
                    value={harbourForm.landmark}
                    onChange={(e) => setHarbourForm({ ...harbourForm, landmark: e.target.value })}
                    placeholder="e.g. Opposite Lighthouse"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    required
                    value={harbourForm.city}
                    onChange={(e) => setHarbourForm({ ...harbourForm, city: e.target.value })}
                    placeholder="e.g. Chennai"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    required
                    value={harbourForm.district}
                    onChange={(e) => setHarbourForm({ ...harbourForm, district: e.target.value })}
                    placeholder="e.g. Chennai District"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    required
                    value={harbourForm.state}
                    onChange={(e) => setHarbourForm({ ...harbourForm, state: e.target.value })}
                    placeholder="e.g. Tamil Nadu"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    required
                    value={harbourForm.country}
                    onChange={(e) => setHarbourForm({ ...harbourForm, country: e.target.value })}
                    placeholder="e.g. India"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Postal Code (PIN Code) *</Label>
                  <Input
                    id="pincode"
                    required
                    value={harbourForm.pincode}
                    onChange={(e) => setHarbourForm({ ...harbourForm, pincode: e.target.value })}
                    placeholder="e.g. 600013"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="google_plus_code">Plus Code (Optional)</Label>
                <Input
                  id="google_plus_code"
                  value={harbourForm.google_plus_code}
                  onChange={(e) => setHarbourForm({ ...harbourForm, google_plus_code: e.target.value })}
                  placeholder="e.g. 8MH9+H4"
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone (Optional)</Label>
                <Input
                  id="timezone"
                  value={harbourForm.timezone}
                  onChange={(e) => setHarbourForm({ ...harbourForm, timezone: e.target.value })}
                  placeholder="e.g. Asia/Kolkata"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Harbour Description / Instructions</Label>
              <Textarea
                id="description"
                value={harbourForm.description}
                onChange={(e) => setHarbourForm({ ...harbourForm, description: e.target.value })}
                placeholder="Enter details, description, or instructions about this port..."
                rows={3}
              />
            </div>

            <div className="flex gap-5 items-center bg-muted/20 border p-4 rounded-xl">
              <div className="flex items-center gap-2">
                <input
                  id="harbour_status"
                  type="checkbox"
                  checked={harbourForm.status}
                  onChange={(e) => setHarbourForm({ ...harbourForm, status: e.target.checked })}
                  className="rounded border-input text-primary focus:ring-primary w-4.5 h-4.5"
                />
                <Label htmlFor="harbour_status" className="font-semibold cursor-pointer">Active Harbour Status</Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="harbour_default"
                  type="checkbox"
                  checked={harbourForm.is_default}
                  onChange={(e) => setHarbourForm({ ...harbourForm, is_default: e.target.checked })}
                  className="rounded border-input text-primary focus:ring-primary w-4.5 h-4.5"
                />
                <Label htmlFor="harbour_default" className="font-semibold cursor-pointer">Set as Default Harbour</Label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setHarbourModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createHarbour.isPending || updateHarbour.isPending} className="bg-primary-900 hover:bg-primary-800">
                {createHarbour.isPending || updateHarbour.isPending ? 'Saving...' : 'Save Harbour'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG: Shipping Range Add/Edit Form */}
      <Dialog open={rangeModalOpen} onOpenChange={setRangeModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{editingRange ? 'Edit Shipping Distance Range' : 'Add Distance-based Shipping Charge'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveRange} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from_distance">From Distance (km) *</Label>
                <Input
                  id="from_distance"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={rangeForm.from_distance}
                  onChange={(e) => setRangeForm({ ...rangeForm, from_distance: e.target.value })}
                  placeholder="e.g. 0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to_distance">To Distance (km) *</Label>
                <Input
                  id="to_distance"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={rangeForm.to_distance}
                  onChange={(e) => setRangeForm({ ...rangeForm, to_distance: e.target.value })}
                  placeholder="e.g. 5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipping_price">Shipping Price (₹) *</Label>
              <Input
                id="shipping_price"
                type="number"
                min="0"
                step="0.01"
                required
                value={rangeForm.shipping_price}
                onChange={(e) => setRangeForm({ ...rangeForm, shipping_price: e.target.value })}
                placeholder="e.g. 30"
              />
            </div>

            <div className="flex items-center gap-2 bg-muted/20 border p-4 rounded-xl">
              <input
                id="range_status"
                type="checkbox"
                checked={rangeForm.status}
                onChange={(e) => setRangeForm({ ...rangeForm, status: e.target.checked })}
                className="rounded border-input text-primary focus:ring-primary w-4.5 h-4.5"
              />
              <Label htmlFor="range_status" className="font-semibold cursor-pointer">Active Range Rule Status</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setRangeModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createRange.isPending || updateRange.isPending} className="bg-primary-900 hover:bg-primary-800">
                {createRange.isPending || updateRange.isPending ? 'Saving...' : 'Save Rule'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
