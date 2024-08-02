import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    //BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    //AppRoutingModule,
    //BrowserAnimationsModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    //BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    //AppRoutingModule,
    MaterialModule, RouterModule
  ]
})
export class SharedcommonModule { }
