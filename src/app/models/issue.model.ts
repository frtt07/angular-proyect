import { Photo } from './photo.model';

export interface Issue {
  id?: number;
  motorcycle_id: number;
  description: string;
  issue_type: 'accident' | 'breakdown' | 'maintenance';
  date_reported: string;
  status: 'open' | 'in_progress' | 'resolved';
  created_at?: string;
  // Relaciones (cuando el backend las incluye)
  photos?: Photo[];
}
