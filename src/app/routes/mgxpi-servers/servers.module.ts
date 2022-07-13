import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MgxpiServerDetailsComponent, MgxpiServersComponent } from './mgxpi-servers.component';
import { ServersRoutingModule } from './servers-routing.module';

@NgModule({
    declarations: [MgxpiServersComponent, MgxpiServerDetailsComponent],
    imports: [SharedModule, ServersRoutingModule],
    providers: []

})
export class ServersModule {
    constructor() {
        console.log('Lazily Loaded Servers : LazyModule');
    }
}
