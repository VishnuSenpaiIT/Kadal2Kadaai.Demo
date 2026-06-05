export interface User {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  status: string;
  has_verified_email: boolean;
  has_verified_phone: boolean;
  roles: string[];
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
