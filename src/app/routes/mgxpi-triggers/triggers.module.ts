import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MgxpiTriggersComponent } from './mgxpi-triggers.component';
import { TriggersRoutingModule } from './triggers-routing.module';

@NgModule({
    declarations: [MgxpiTriggersComponent],
    imports: [SharedModule, TriggersRoutingModule],
    providers: []

})
export class TriggersModule {
    constructor() {
        console.log('Lazily Loaded Triggers : LazyModule');
    }
}
