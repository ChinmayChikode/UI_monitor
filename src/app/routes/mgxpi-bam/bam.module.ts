import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BAMRoutingModule } from './bam-routing.module';
import { MgxpiBamComponent, MgxpiBamDetailsComponent} from './mgxpi-bam.component';
import { RefreshIntervalComponent } from '../refresh-interval/refresh-interval.component';
//import { MgxpiBAMFiltersComponent } from './bam.service';
import { HttpClientModule } from '@angular/common/http';
import { MgxpiBAMFiltersComponent } from './mgxpi-bam-filters';

@NgModule({
    declarations: [MgxpiBamDetailsComponent,MgxpiBAMFiltersComponent, MgxpiBamComponent, RefreshIntervalComponent],
    entryComponents : [MgxpiBamDetailsComponent,RefreshIntervalComponent,MgxpiBAMFiltersComponent],
    imports: [SharedModule, BAMRoutingModule,HttpClientModule],
    providers: []

})

export class BAMModule {
    constructor() {
        console.log('Lazily Loaded BAM : LazyModule');
    }
}
