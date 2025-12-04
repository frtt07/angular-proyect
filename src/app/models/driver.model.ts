export interface Driver {
  id?: number;
  name: string;
  license_number: string;
  phone: string;
  email?: string;
  status: 'available' | 'on_shift' | 'unavailable';
  created_at?: string;
}
