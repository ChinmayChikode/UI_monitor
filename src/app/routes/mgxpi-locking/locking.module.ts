import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { LockingRoutingModule } from './locking-routing.module';
import { MgxpiLockingComponent } from './mgxpi-locking.component';

@NgModule({
    declarations: [MgxpiLockingComponent],
    imports: [SharedModule, LockingRoutingModule],
    providers: []

})
export class LockingModule {
    constructor() {
        console.log('Lazily Loaded Locking : LazyModule');
    }
}
