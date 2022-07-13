import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MgxpiSummaryComponent } from './mgxpi-summary.component';
import { SummaryRoutingModule } from './summary-routing.module';

@NgModule({
    declarations: [MgxpiSummaryComponent],
    imports: [SharedModule, SummaryRoutingModule],
    providers: []

})
export class SummaryModule {
    constructor() {
        console.log('Lazily Loaded Summary : LazyModule');
    }
}
