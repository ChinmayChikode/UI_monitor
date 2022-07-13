import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ODSRoutingModule } from './ods-routing.module';
import { MgxpiOdsComponent } from './mgxpi-ods.component';
import { OdsClearAllComponent } from './ods.service';

@NgModule({
    declarations: [MgxpiOdsComponent, OdsClearAllComponent],
    entryComponents : [OdsClearAllComponent],
    imports: [SharedModule, ODSRoutingModule],
    providers: []

})
export class ODSModule {
    constructor() {
        console.log('Lazily Loaded ODS : LazyModule');
    }
}
