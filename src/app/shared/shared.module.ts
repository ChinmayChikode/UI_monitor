import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { MaterialExtensionsModule } from '@ng-matero/extensions';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressRouterModule } from '@ngx-progressbar/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { ToastrModule } from 'ngx-toastr';
import { NgxPopperModule } from 'ngx-popper';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { ColorPickerModule } from 'primeng/colorpicker';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TimeoutComponent } from 'app/routes/admin-layout/sidemenu/sidemenu.component';
import * as Material from "@angular/material";


const THIRD_MODULES = [
  MaterialModule,
  MaterialExtensionsModule,
  FlexLayoutModule,
  NgProgressModule,
  NgProgressRouterModule,
  NgSelectModule,
  FormlyMaterialModule,
  NgxPopperModule,
];

const FOURTH_MODULES = [
  Material.MatToolbarModule,
  Material.MatGridListModule,
  Material.MatFormFieldModule,
  Material.MatInputModule,
  Material.MatRadioModule,
  Material.MatSelectModule,
  Material.MatCheckboxModule,
  Material.MatDatepickerModule,
  Material.MatNativeDateModule,
  Material.MatButtonModule,
  Material.MatSnackBarModule,
  Material.MatTableModule,
  Material.MatIconModule,
  Material.MatPaginatorModule,
  Material.MatSortModule,
  Material.MatDialogModule
];

const COMPONENTS = [];
const COMPONENTS_DYNAMIC = [TimeoutComponent];
const DIRECTIVES = [];
const PIPES = [];

@NgModule({
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC, ...DIRECTIVES, ...PIPES],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    ToastrModule.forRoot(),
    ...THIRD_MODULES,
    ...FOURTH_MODULES
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FormlyModule,
    ToastrModule,
    ...THIRD_MODULES,
    ...FOURTH_MODULES,
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
    MatDatepickerModule, MatMomentDateModule, RouterModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    TriStateCheckboxModule,
    ColorPickerModule,
    OverlayPanelModule
  ],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class SharedModule {

  static global_interval:number = 5000
}
