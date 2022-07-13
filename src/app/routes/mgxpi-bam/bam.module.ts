import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BAMRoutingModule } from './bam-routing.module';
import { MgxpiBamComponent, MgxpiBAMFiltersComponent } from './mgxpi-bam.component';

@NgModule({
    declarations: [MgxpiBAMFiltersComponent, MgxpiBamComponent],
    imports: [SharedModule, BAMRoutingModule],
    providers: []

})
export class BAMModule {
    constructor() {
        console.log('Lazily Loaded BAM : LazyModule');
    }
}
