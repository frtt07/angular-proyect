import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PhotosRoutingModule } from './photos-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';

@NgModule({
  declarations: [ListComponent, ManageComponent],
  imports: [CommonModule, PhotosRoutingModule, FormsModule, ReactiveFormsModule]
})
export class PhotosModule { }