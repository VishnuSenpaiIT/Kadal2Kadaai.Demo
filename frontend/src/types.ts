export type SeafoodCategory = string;

export interface SeafoodProduct {
  id: string;
  name: string;
  tamilName?: string;
  category: SeafoodCategory;
  subCategory?: string; // e.g. "Dry Fish", "Pure Water Fish", etc.
  price: number; // per kg or per unit
  image: string;
  rating: number;
  reviewsCount: number;
  freshnessBadge: string;
  tag?: string; // e.g. "Best seller", "Morning's Best"
  harborLocation?: string; // e.g. "Rameswaram coastal area"
  description: string;
  availableWeights: string[]; // e.g., ["500g", "1kg", "2kg"]
  availableCuts: string[]; // e.g., ["Whole (Uncleaned)", "Cleaned & Gutted", "Steaks / Slices", "Curry Cut"]
  isPopular: boolean;
  stock?: number; // per unit or kg, defaults, e.g. 100
}

export interface TodayPurchaseItem {
  id: string;
  name: string;
  image: string;
  demandMeter: number; // active % demand indicator
  householdsPurchasedCount: number;
  weightSelected: string;
  cutType: string;
  price: number;
  category?: string;
  tag?: string;
}

export interface HarborArrival {
  id: string;
  harborName: string;
  district: string;
  catchTime: string;
  arrivalCount: number;
  freshnessIndex: number; // e.g. 98, 99
  primaryCatcherBoat: string;
  featuredFish: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface CartItem {
  product: SeafoodProduct;
  selectedWeight: string;
  selectedCut: string;
  quantity: number;
}

export interface WishlistItem {
  product: SeafoodProduct;
}

export interface UserSession {
  username?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
  isAuthenticated: boolean;
  firstName?: string;
  lastName?: string;
  district?: string;
  locality?: string;
  address?: string;
  isAdmin?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  weight: string;
  cut: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  district: string;
  locality: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  date: string;
  slot: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  orderStatus: 'Pending' | 'SWAB Tested' | 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled';
  transactionId: string;
  paymentMethod: string;
  notes?: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  contactNumber: string;
  email: string;
  district: string;
  locality: string;
  address: string;
  orderHistory: string[]; // Order IDs
  createdAt: string;
}

export interface PaymentTransaction {
  transactionId: string;
  orderId: string;
  customerName: string;
  amount: number;
  status: 'Successful' | 'Pending' | 'Failed';
  date: string;
  paymentMethod: string;
}
