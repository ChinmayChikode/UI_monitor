import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ODSRoutingModule } from './ods-routing.module';
import { MgxpiOdsComponent } from './mgxpi-ods.component';

@NgModule({
    declarations: [MgxpiOdsComponent],
    imports: [SharedModule, ODSRoutingModule],
    providers: []

})
export class ODSModule {
    constructor() {
        console.log('Lazily Loaded ODS : LazyModule');
    }
}
