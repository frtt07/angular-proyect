import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenusRoutingModule } from './menus-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';

@NgModule({
  declarations: [ListComponent, ManageComponent],
  imports: [CommonModule, MenusRoutingModule, FormsModule, ReactiveFormsModule]
})
export class MenusModule { }