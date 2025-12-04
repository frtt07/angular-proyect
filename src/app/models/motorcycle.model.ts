export interface Motorcycle {
  id?: number;
  license_plate: string;
  brand: string;
  year: number;
  status: 'available' | 'in_use' | 'maintenance';
  created_at?: string;
}
