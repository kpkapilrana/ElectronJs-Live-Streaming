import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { MatButtonModule, MatCheckboxModule, MatOptionModule, MatPaginatorModule, MatRadioModule, MatSelectModule, MatSortModule, MatTableModule, MatToolbarModule, MatTooltipModule, MatGridListModule, MatSlideToggleModule, MatExpansionModule } from "@angular/material";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatRippleModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTreeModule } from "@angular/material/tree";

const AngularMatModules = [
  MatIconModule,
  MatTooltipModule,
  MatRadioModule,
  MatOptionModule,
  MatSelectModule,
  // MatSelectInfiniteScrollModule,
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatSidenavModule,
  MatCardModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatDividerModule,
  MatListModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatTabsModule,
  MatTreeModule,
  MatRippleModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatExpansionModule,
  MatGridListModule,
  MatSlideToggleModule
];
@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective],
  imports: [CommonModule, TranslateModule, FormsModule,ReactiveFormsModule, ...AngularMatModules],
  exports: [TranslateModule, WebviewDirective, FormsModule, ReactiveFormsModule,
    ...AngularMatModules
  ]
})
export class SharedModule {}
