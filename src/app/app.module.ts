import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './routes/admin-layout/admin-layout.component';
import { SidemenuComponent } from './routes/admin-layout/sidemenu/sidemenu.component';
import { DashboardComponent } from './routes/mgxpi-dashboard/dashboard.component';
import { LicenseUsagesComponent } from './routes/mgxpi-dashboard/license-usages/license-usages.component';
import { ProjectAlertComponent } from './routes/mgxpi-dashboard/project-alert/project-alert.component';
import { ProjectLoadComponent } from './routes/mgxpi-dashboard/project-load/project-load.component';
import { TriggerActivityComponent } from './routes/mgxpi-dashboard/trigger-activity/trigger-activity.component';
import { MgxpiLoginComponent } from './routes/mgxpi-login/mgxpi-login.component';
import { ChatModule } from '@progress/kendo-angular-conversational-ui';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartsModule } from 'ng2-charts';
// import { NgxLoadingModule } from 'ngx-loading';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { CustomizerComponent } from './routes/admin-layout/customizer/customizer.component';
import { BrandingComponent } from './routes/admin-layout/header/branding.component';
import { HeaderComponent } from './routes/admin-layout/header/header.component';
import { UserComponent } from './routes/admin-layout/header/user.component';
import { SidebarComponent } from './routes/admin-layout/sidebar/sidebar.component';
import { AccordionDirective } from './routes/admin-layout/sidemenu/accordion.directive';
import { AccordionAnchorDirective } from './routes/admin-layout/sidemenu/accordionanchor.directive';
import { AccordionLinkDirective } from './routes/admin-layout/sidemenu/accordionlink.directive';
import { ProjectSearchPipe } from './routes/admin-layout/sidemenu/projectsearch.pipe';
import { MgxpiMenuSidenavComponent } from './routes/mgxpi-menu-sidenav/mgxpi-menu-sidenav.component';
import { StepNamePipe } from './routes/mgxpi-servers/step-name.pipe';
import { ActivityFiltersService } from './routes/mgxpi-activity/activity-filters.service';
import { AppRoutingModule } from './app-routing.module';
import { MgxpiLicenseSummaryComponent } from './routes/mgxpi-license-summary/mgxpi-license-summary.component';
import { UserPanelComponent } from './routes/admin-layout/sidebar/user-panel.component';

@NgModule({
  exports: [RouterModule],
  declarations: [
    AppComponent,
    DashboardComponent,
    StepNamePipe,
    MgxpiMenuSidenavComponent,
    AdminLayoutComponent,
    SidemenuComponent,
    AccordionAnchorDirective,
    AccordionDirective,
    AccordionLinkDirective,
    HeaderComponent,
    BrandingComponent,
    UserComponent,
    CustomizerComponent,
    ProjectSearchPipe,
    SidebarComponent,
    MgxpiLoginComponent,
    TriggerActivityComponent,
    ProjectAlertComponent,
    ProjectLoadComponent,
    LicenseUsagesComponent,
    MgxpiLicenseSummaryComponent,
    UserPanelComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    // NgxLoadingModule.forRoot({}),
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
    SliderModule,
    ChartsModule,
    DialogModule,
    ChatModule,
    SharedModule,
    NgApexchartsModule,
    AppRoutingModule
  ],
  providers: [
    ActivityFiltersService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
