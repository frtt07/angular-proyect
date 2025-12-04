import { Product } from './product.model';
import { Restaurant } from './restaurant.model';

export interface Menu {
  id?: number;
  restaurant_id: number;
  product_id: number;
  price: number;
  availability: boolean;
  created_at?: string;
  // Relaciones (cuando el backend las incluye)
  product?: Product;
  restaurant?: Restaurant;
}
