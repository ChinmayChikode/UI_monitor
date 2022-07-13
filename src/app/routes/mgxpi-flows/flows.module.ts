import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { FlowsRoutingModule } from './flows-routing.module';
import { MgxpiFlowsComponent } from './mgxpi-flows.component';

@NgModule({
    declarations: [MgxpiFlowsComponent],
    imports: [SharedModule, FlowsRoutingModule],
    providers: []

})
export class FlowsModule {
    constructor() {
        console.log('Lazily Loaded Flows : LazyModule');
    }
}
