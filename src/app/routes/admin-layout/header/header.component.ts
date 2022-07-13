import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import * as screenfull from 'screenfull';
import { ProjectSelection } from './../sidemenu/projectselection.service';
import { SettingsService } from '@core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class HeaderComponent implements OnInit {

  projectName: string;
  projectStartedSince: string;
  screen  = true;

  options = this.settings.getOptions();
  @Output() optionsEvent = new EventEmitter<object>();

  @Input() showToggle = true;
  @Input() showBranding = false;

  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleSidenavNotice = new EventEmitter<void>();

  private get screenfull(): screenfull.Screenfull {
    return screenfull as screenfull.Screenfull;
  }

  constructor(private projectSelection: ProjectSelection,private settings: SettingsService) {}

  ngOnInit() {

    this.projectSelection.$projectKey.subscribe((projectKey: any) => {
      this.projectName = projectKey;
    });

    this.projectSelection.$projectStartedSince.subscribe((projectStartedSince: any) => {
      this.projectStartedSince = projectStartedSince;
    });

  }

  // TODO:
  toggleFullscreen() {

    if (this.screenfull.enabled) {

      this.screenfull.toggle();
      if(this.screenfull.isFullscreen){

        this.screen = true;
      }
      else{
  
        this.screen = false;
      }
    }
    
  }


  sendOptions() {
    this.optionsEvent.emit(this.options);
  }
}
