import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';
import { MotorcycleService } from 'src/app/services/motorcycle.service';
import { interval, Subscription } from 'rxjs';

// Fix para los iconos de Leaflet en Angular
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

interface MotorcycleLocation {
  id: number;
  license_plate: string;
  lat: number;
  lng: number;
  order_id?: number;
  customer_name?: string;
  status: string;
  driver_name?: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {

  private map: L.Map;
  private markers: Map<number, L.Marker> = new Map();
  private updateSubscription: Subscription;
  
  orders: Order[] = [];
  motorcycleLocations: MotorcycleLocation[] = [];
  selectedMotorcycle: MotorcycleLocation | null = null;
  isLoading: boolean = true;
  autoRefresh: boolean = true;
  refreshInterval: number = 5; // segundos

  // Centro del mapa (Manizales, Colombia como ejemplo)
  private defaultCenter: L.LatLngExpression = [5.0689, -75.5174];
  private defaultZoom: number = 13;

  // Iconos personalizados para diferentes estados
  private icons = {
    available: this.createCustomIcon('green'),
    in_use: this.createCustomIcon('blue'),
    delivering: this.createCustomIcon('orange'),
    maintenance: this.createCustomIcon('red')
  };

  constructor(
    private orderService: OrderService,
    private motorcycleService: MotorcycleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadActiveOrders();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: this.defaultCenter,
      zoom: this.defaultZoom
    });

    // Capa de OpenStreetMap (gratuita)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Capa alternativa más bonita (Carto)
    // L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    //   maxZoom: 19,
    //   attribution: '© OpenStreetMap contributors © CARTO'
    // }).addTo(this.map);
  }

  private createCustomIcon(color: string): L.DivIcon {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <i class="fas fa-motorcycle" style="
            transform: rotate(45deg);
            color: white;
            font-size: 14px;
          "></i>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    });
  }

  loadActiveOrders(): void {
    this.isLoading = true;
    this.orderService.list().subscribe({
      next: (orders) => {
        // Filtrar solo pedidos activos (pending o in_progress)
        this.orders = orders.filter(o => 
          o.status === 'pending' || o.status === 'in_progress'
        );
        this.loadMotorcycleLocations();
      },
      error: (err) => {
        console.error('Error cargando pedidos:', err);
        this.isLoading = false;
      }
    });
  }

  loadMotorcycleLocations(): void {
    // Simulamos ubicaciones de motos (en producción vendrían del backend con GPS real)
    // El backend debería tener un endpoint como GET /motorcycles/locations
    
    this.motorcycleLocations = this.generateSimulatedLocations();
    this.updateMapMarkers();
    this.isLoading = false;
  }

  private generateSimulatedLocations(): MotorcycleLocation[] {
    // Simulación de ubicaciones alrededor del centro (Manizales)
    // En producción, esto vendría del backend con datos GPS reales
    const baseLocations: MotorcycleLocation[] = [];
    
    this.orders.forEach((order, index) => {
      if (order.motorcycle_id) {
        const randomOffset = () => (Math.random() - 0.5) * 0.05;
        baseLocations.push({
          id: order.motorcycle_id,
          license_plate: order.motorcycle.license_plate || `MOTO-${order.motorcycle_id}`,
          lat: 5.0689 + randomOffset(),
          lng: -75.5174 + randomOffset(),
          order_id: order.id,
          customer_name: order.customer?.name || 'Cliente',
          status: order.status === 'in_progress' ? 'delivering' : 'in_use',
          driver_name: 'Conductor Asignado'
        });
      }
    });

    return baseLocations;
  }

  private updateMapMarkers(): void {
    // Limpiar markers anteriores
    this.markers.forEach(marker => marker.remove());
    this.markers.clear();

    // Agregar nuevos markers
    this.motorcycleLocations.forEach(moto => {
      const icon = this.icons[moto.status] || this.icons.in_use;
      
      const marker = L.marker([moto.lat, moto.lng], { icon })
        .addTo(this.map)
        .bindPopup(this.createPopupContent(moto));

      marker.on('click', () => {
        this.selectedMotorcycle = moto;
      });

      this.markers.set(moto.id, marker);
    });

    // Ajustar vista para mostrar todos los markers
    if (this.motorcycleLocations.length > 0) {
      const group = L.featureGroup(Array.from(this.markers.values()));
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  private createPopupContent(moto: MotorcycleLocation): string {
    const statusText = this.getStatusText(moto.status);
    const statusColor = this.getStatusColor(moto.status);
    
    return `
      <div style="min-width: 200px;">
        <h6 style="margin: 0 0 10px 0; border-bottom: 1px solid #eee; padding-bottom: 5px;">
          <i class="fas fa-motorcycle"></i> ${moto.license_plate}
        </h6>
        <p style="margin: 5px 0;"><strong>Estado:</strong> 
          <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span>
        </p>
        ${moto.order_id ? `<p style="margin: 5px 0;"><strong>Pedido:</strong> #${moto.order_id}</p>` : ''}
        ${moto.customer_name ? `<p style="margin: 5px 0;"><strong>Cliente:</strong> ${moto.customer_name}</p>` : ''}
        ${moto.driver_name ? `<p style="margin: 5px 0;"><strong>Conductor:</strong> ${moto.driver_name}</p>` : ''}
        <p style="margin: 5px 0; font-size: 11px; color: #888;">
          <i class="fas fa-map-marker-alt"></i> ${moto.lat.toFixed(4)}, ${moto.lng.toFixed(4)}
        </p>
      </div>
    `;
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'available': return 'Disponible';
      case 'in_use': return 'En uso';
      case 'delivering': return 'Entregando';
      case 'maintenance': return 'Mantenimiento';
      default: return status;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'available': return 'green';
      case 'in_use': return 'blue';
      case 'delivering': return 'orange';
      case 'maintenance': return 'red';
      default: return 'gray';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'available': return 'badge-success';
      case 'in_use': return 'badge-info';
      case 'delivering': return 'badge-warning';
      case 'maintenance': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  startAutoRefresh(): void {
    if (this.autoRefresh) {
      this.updateSubscription = interval(this.refreshInterval * 1000).subscribe(() => {
        this.refreshLocations();
      });
    }
  }

  toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    if (this.autoRefresh) {
      this.startAutoRefresh();
    } else if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  refreshLocations(): void {
    // Simular movimiento de motos (en producción sería una llamada al backend)
    this.motorcycleLocations = this.motorcycleLocations.map(moto => ({
      ...moto,
      lat: moto.lat + (Math.random() - 0.5) * 0.002,
      lng: moto.lng + (Math.random() - 0.5) * 0.002
    }));
    
    // Actualizar posición de markers existentes (más eficiente que recrear)
    this.motorcycleLocations.forEach(moto => {
      const marker = this.markers.get(moto.id);
      if (marker) {
        marker.setLatLng([moto.lat, moto.lng]);
        marker.setPopupContent(this.createPopupContent(moto));
      }
    });
  }

  centerOnMotorcycle(moto: MotorcycleLocation): void {
    this.selectedMotorcycle = moto;
    this.map.setView([moto.lat, moto.lng], 16);
    const marker = this.markers.get(moto.id);
    if (marker) {
      marker.openPopup();
    }
  }

  viewOrder(orderId: number): void {
    this.router.navigate(['/orders/view', orderId]);
  }

  back(): void {
    this.router.navigate(['/orders/list']);
  }
}