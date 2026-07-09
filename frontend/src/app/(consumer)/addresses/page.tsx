'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  Address
} from '@/shared/api/hooks/useAddresses';
import { useGoogleMapsKey } from '@/shared/api/hooks/useShippingCalculation';
import { Container } from '@/components/layout/shared/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Home,
  Briefcase,
  Navigation,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import HarbourLocationPicker from '@/components/domain/harbour/HarbourLocationPicker';

export default function AddressesPage() {
  const router = useRouter();
  const { data: addresses, isLoading } = useAddresses();
  const { data: mapsConfig } = useGoogleMapsKey();
  
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
    house_flat_number: '',
    street_name: '',
    area_locality: '',
    landmark: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    latitude: '13.0827' as string | number,
    longitude: '80.2707' as string | number,
    address_type: 'Home' as 'Home' | 'Work' | 'Other',
    delivery_instructions: '',
  });

  const resetForm = () => {
    setFormData({
      full_name: '',
      mobile_number: '',
      house_flat_number: '',
      street_name: '',
      area_locality: '',
      landmark: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
      latitude: '13.0827',
      longitude: '80.2707',
      address_type: 'Home',
      delivery_instructions: '',
    });
  };


  const handleOpenAddForm = () => {
    setEditingAddress(null);
    resetForm();
    setShowForm(true);
  };

  const handleOpenEditForm = (addr: Address) => {
    setEditingAddress(addr);
    setFormData({
      full_name: addr.full_name,
      mobile_number: addr.mobile_number,
      house_flat_number: addr.house_flat_number,
      street_name: addr.street_name,
      area_locality: addr.area_locality,
      landmark: addr.landmark || '',
      city: addr.city,
      district: addr.district,
      state: addr.state,
      pincode: addr.pincode,
      latitude: addr.latitude,
      longitude: addr.longitude,
      address_type: addr.address_type,
      delivery_instructions: addr.delivery_instructions || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.latitude === '' || formData.longitude === '') {
      alert('Please select your location on the map to pinpoint precise coordinates for deliveries.');
      return;
    }

    const payload = {
      full_name: formData.full_name,
      mobile_number: formData.mobile_number,
      house_flat_number: formData.house_flat_number,
      street_name: formData.street_name,
      area_locality: formData.area_locality,
      landmark: formData.landmark || null,
      city: formData.city,
      district: formData.district,
      state: formData.state,
      pincode: formData.pincode,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      address_type: formData.address_type,
      delivery_instructions: formData.delivery_instructions || null,
      is_default: editingAddress ? editingAddress.is_default : false,
    };

    if (editingAddress) {
      updateAddress.mutate({ id: editingAddress.id, payload }, {
        onSuccess: () => {
          setShowForm(false);
          setEditingAddress(null);
          resetForm();
        },
        onError: (err: any) => {
          alert('Failed to update address: ' + (err.response?.data?.message || err.message));
        }
      });
    } else {
      createAddress.mutate(payload, {
        onSuccess: () => {
          setShowForm(false);
          resetForm();
        },
        onError: (err: any) => {
          alert('Failed to save address: ' + (err.response?.data?.message || err.message));
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-semibold">Loading your addresses...</p>
      </div>
    );
  }

  return (
    <div className="py-12 bg-muted/20 min-h-screen">
      <Container>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-1 border-border bg-background"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            <div>
              <h1 className="text-3xl font-heading font-black text-foreground">My Addresses</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Manage delivery locations for fresh catch dispatches.</p>
            </div>
          </div>
          <Button 
            onClick={showForm ? () => setShowForm(false) : handleOpenAddForm} 
            variant={showForm ? "outline" : "default"}
            className="w-full sm:w-auto"
          >
            {showForm ? 'Cancel' : <><Plus className="h-4 w-4 mr-2" /> Add New Address</>}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT: Address Cards List / Main panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {showForm && (
              <div className="bg-card border rounded-2xl p-6 shadow-sm mb-6 space-y-6">
                <h3 className="font-bold text-lg border-b pb-2 text-foreground">
                  {editingAddress ? 'Edit Address Details' : 'Add New Address'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Basic Contacts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input
                        id="full_name"
                        required
                        value={formData.full_name}
                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="e.g. Aditi Sharma"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile_number">Mobile Number *</Label>
                      <Input
                        id="mobile_number"
                        required
                        value={formData.mobile_number}
                        onChange={e => setFormData({ ...formData, mobile_number: e.target.value })}
                        placeholder="e.g. +91 9876543210"
                      />
                    </div>
                  </div>

                  {/* Coordinates & Google Maps Picker */}
                  <div className="hidden grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lat">Latitude</Label>
                      <Input
                        id="lat"
                        type="number"
                        step="0.000001"
                        value={formData.latitude}
                        onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                        placeholder="e.g. 13.0827"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lng">Longitude</Label>
                      <Input
                        id="lng"
                        type="number"
                        step="0.000001"
                        value={formData.longitude}
                        onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                        placeholder="e.g. 80.2707"
                      />
                    </div>
                  </div>

                  {/* Render Google Maps component for picking address */}
                  {mapsConfig?.google_maps_api_key ? (
                    <HarbourLocationPicker
                      apiKey={mapsConfig.google_maps_api_key}
                      latitude={formData.latitude !== '' ? Number(formData.latitude) : null}
                      longitude={formData.longitude !== '' ? Number(formData.longitude) : null}
                      onChange={(lat, lng, addrDetails) => {
                        setFormData({
                          ...formData,
                          latitude: lat,
                          longitude: lng,
                          house_flat_number: addrDetails.address_line_1 || formData.house_flat_number,
                          street_name: addrDetails.address_line_1 || formData.street_name,
                          area_locality: addrDetails.area_locality || formData.area_locality,
                          city: addrDetails.city || formData.city,
                          district: addrDetails.district || formData.district,
                          state: addrDetails.state || formData.state,
                          pincode: addrDetails.pincode || formData.pincode,
                        });
                      }}
                    />
                  ) : (
                    <div className="border border-amber-200 bg-amber-50 text-amber-800 rounded-xl p-4 text-xs flex gap-3">
                      <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-600" />
                      <div>
                        <span className="font-semibold block mb-0.5">Interactive Map Disabled</span>
                        Google maps SDK credentials are not configured yet on backend settings. 
                        You can still enter location coordinates manually above.
                      </div>
                    </div>
                  )}

                  {/* House details & Location fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="house_flat">House / Flat Number *</Label>
                      <Input
                        id="house_flat"
                        required
                        value={formData.house_flat_number}
                        onChange={e => setFormData({ ...formData, house_flat_number: e.target.value })}
                        placeholder="e.g. Flat 302, Block A"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="street_name">Street Name *</Label>
                      <Input
                        id="street_name"
                        required
                        value={formData.street_name}
                        onChange={e => setFormData({ ...formData, street_name: e.target.value })}
                        placeholder="e.g. 5th Cross Road"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="locality">Area / Locality *</Label>
                      <Input
                        id="locality"
                        required
                        value={formData.area_locality}
                        onChange={e => setFormData({ ...formData, area_locality: e.target.value })}
                        placeholder="e.g. Royapuram"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="landmark">Landmark (Optional)</Label>
                      <Input
                        id="landmark"
                        value={formData.landmark}
                        onChange={e => setFormData({ ...formData, landmark: e.target.value })}
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
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Chennai"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">Locality *</Label>
                      <Input
                        id="district"
                        required
                        value={formData.district}
                        onChange={e => setFormData({ ...formData, district: e.target.value })}
                        placeholder="e.g. Anna Nagar, Adyar"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        required
                        value={formData.state}
                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                        placeholder="e.g. Tamil Nadu"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code / Postal Code *</Label>
                      <Input
                        id="pincode"
                        required
                        value={formData.pincode}
                        onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                        placeholder="e.g. 600013"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address Type *</Label>
                      <div className="flex gap-3">
                        {(['Home', 'Work', 'Other'] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, address_type: type })}
                            className={`flex-1 py-2 px-3 border rounded-xl text-xs font-bold transition-all ${
                              formData.address_type === type
                                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                : 'bg-background hover:bg-muted text-muted-foreground'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
                    <Textarea
                      id="instructions"
                      value={formData.delivery_instructions}
                      onChange={e => setFormData({ ...formData, delivery_instructions: e.target.value })}
                      placeholder="e.g. Ring doorbell, drop at security guard cabin..."
                      rows={2.5}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t">
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createAddress.isPending || updateAddress.isPending}>
                      {createAddress.isPending || updateAddress.isPending ? 'Saving...' : 'Save Address'}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* List addresses cards */}
            {addresses && addresses.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-5">
                {addresses.map((address) => (
                  <div 
                    key={address.id} 
                    onClick={() => { if (!address.is_default) setDefaultAddress.mutate(address.id) }}
                    className={`bg-card border rounded-2xl p-6 shadow-sm flex flex-col relative transition-all ${
                      !address.is_default 
                        ? 'cursor-pointer hover:border-primary/50 hover:shadow-md border-border/80' 
                        : 'border-primary ring-1 ring-primary shadow-md shadow-primary/5'
                    }`}
                  >
                    {address.is_default && (
                      <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-2xs font-extrabold px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                        Default
                      </span>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                      {address.address_type === 'Work' ? (
                        <Briefcase className={`h-5 w-5 ${address.is_default ? 'text-primary' : 'text-muted-foreground'}`} />
                      ) : (
                        <Home className={`h-5 w-5 ${address.is_default ? 'text-primary' : 'text-muted-foreground'}`} />
                      )}
                      <h3 className="font-bold text-base text-foreground">{address.address_type}</h3>
                    </div>

                    <div className="space-y-1.5 text-sm text-foreground/90 flex-1">
                      <p className="font-bold text-foreground">{address.full_name}</p>
                      <p className="text-xs text-muted-foreground font-semibold">📞 {address.mobile_number}</p>
                      <p className="leading-relaxed mt-1">
                        {address.house_flat_number}, {address.street_name}<br/>
                        {address.area_locality}, {address.city}, {address.district}<br/>
                        {address.state} - <span className="font-mono font-bold">{address.pincode}</span>
                      </p>
                      {address.landmark && (
                        <p className="text-xs italic text-muted-foreground mt-1">
                          <span className="font-semibold not-italic">Landmark:</span> {address.landmark}
                        </p>
                      )}
                      {address.delivery_instructions && (
                        <div className="bg-muted/40 p-2.5 rounded-lg border text-xs text-muted-foreground mt-2 leading-relaxed">
                          <span className="font-bold text-foreground/80 block mb-0.5">Instructions:</span>
                          {address.delivery_instructions}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-2xs font-semibold text-muted-foreground/70 pt-2">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>Lat: {address.latitude.toFixed(5)}, Lng: {address.longitude.toFixed(5)}</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t flex justify-between items-center gap-4 z-10">
                      <div className="text-2xs font-bold text-muted-foreground/80">
                        {address.is_default ? (
                          <span className="text-primary font-extrabold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Primary Address
                          </span>
                        ) : (
                          <span>Click to set as default</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); handleOpenEditForm(address); }}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                          onClick={(e) => { e.stopPropagation(); deleteAddress.mutate(address.id); }}
                          disabled={deleteAddress.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !showForm && (
                <div className="text-center py-16 bg-card border rounded-2xl border-dashed">
                  <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2 text-foreground">No addresses registered</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Please add a delivery address with geographic coordinates to continue browsing and purchasing catches.</p>
                  <Button onClick={handleOpenAddForm}>Add Address</Button>
                </div>
              )
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
