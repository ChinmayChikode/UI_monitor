import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ActivityRoutingModule } from './activity-routing.module';
import { MgxpiActivityFiltersComponent, MgxpiActivityLogDeleteComponent, MgxpiActivityComponent } from './mgxpi-activity.component';

@NgModule({
    declarations: [MgxpiActivityFiltersComponent, MgxpiActivityLogDeleteComponent, MgxpiActivityComponent],
    imports: [SharedModule, ActivityRoutingModule],
    providers: []

})
export class ActivityModule {
    constructor() {
        console.log('Lazily Loaded ActivityLog : LazyModule');
    }
}
