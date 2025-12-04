import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdersRoutingModule } from './orders-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [ListComponent, ManageComponent, MapComponent],
  imports: [CommonModule, OrdersRoutingModule, FormsModule, ReactiveFormsModule]
})
export class OrdersModule { }