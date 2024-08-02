import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatRadioModule} from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    //material imports
    MatCardModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatProgressBarModule,

    MatProgressSpinnerModule,
MatStepperModule,

    MatInputModule,
    MatTabsModule,
    MatTooltipModule,
    MatIconModule,
    MatDialogModule,
    MatListModule,
    //MatCardModule,

    MatSlideToggleModule,
    MatSelectModule,

    MatAutocompleteModule,
    MatTabsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatPaginatorModule,

    MatFormFieldModule,
    MatRadioModule,
    MatTooltipModule
    //MatSelectModule,
  ],
  exports:[
    BrowserAnimationsModule,
    MatCardModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatProgressBarModule,

    MatProgressSpinnerModule,
MatStepperModule,

    MatInputModule,
    MatTabsModule,
    MatTooltipModule,
    MatIconModule,
    MatDialogModule,
    MatListModule,
    //MatCardModule,

    MatSlideToggleModule,
    MatSelectModule,

    MatAutocompleteModule,
    MatTabsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatPaginatorModule,

    MatFormFieldModule,
    MatRadioModule,
MatTooltipModule
    //MatSelectModule,

  ]
})
export class MaterialModule { }
