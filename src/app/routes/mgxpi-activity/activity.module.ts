import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ActivityRoutingModule } from './activity-routing.module';
import { MgxpiActivityFiltersComponent, MgxpiActivityLogDeleteComponent, MgxpiActivityComponent, MgxpiActivityLogRefreshComponent, MgxpiActivityLogDetailsComponent, MgxpiDateTimeFilterComponent } from './mgxpi-activity.component';

//import { RefreshIntervalComponent } from '../refresh-interval/refresh-interval.component';
//import { RefreshTableComponent } from 'app/refresh-table/refresh-table.component';

@NgModule({
    declarations: [MgxpiActivityLogDetailsComponent,MgxpiActivityFiltersComponent, MgxpiActivityLogDeleteComponent, MgxpiActivityComponent,MgxpiActivityLogRefreshComponent,MgxpiDateTimeFilterComponent],
    entryComponents : [MgxpiActivityLogDetailsComponent,MgxpiActivityLogRefreshComponent,MgxpiActivityLogDeleteComponent,MgxpiDateTimeFilterComponent],
    imports: [SharedModule, ActivityRoutingModule],
    providers: []

})
export class ActivityModule {
    constructor() {
        console.log('Lazily Loaded ActivityLog : LazyModule');
    }
}
