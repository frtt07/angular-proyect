import { Driver } from './driver.model';
import { Motorcycle } from './motorcycle.model';

export interface Shift {
  id?: number;
  driver_id: number;
  motorcycle_id: number;
  start_time: string;
  end_time?: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at?: string;
  // Relaciones (cuando el backend las incluye)
  driver?: Driver;
  motorcycle?: Motorcycle;
}
