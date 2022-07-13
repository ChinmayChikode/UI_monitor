import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PreloaderService, SettingsService } from '@core';
import { SidenavService } from './services/sidenav.service';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  providers:  [ SidenavService ]
})
export class AppComponent implements OnInit, AfterViewInit {

  url: any;
  options = this.settings.getOptions();

  constructor(private preloader: PreloaderService, private router: Router,
              public settings: SettingsService) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log('Event URL Friedn : '+ event.url);
      console.log('Event URL Friedn : '+ event.url);
      this.url = event.url;
    });
  }
  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  ngOnInit() {
    // UI Table Height Controller as per screen size
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      const pHeight = document.getElementsByClassName('matero-toolbar')[0].clientHeight;
      const mToolHeight = document.getElementsByClassName('matero-toolbar')[0].clientHeight;
      let adjestHeight = 0;
      if ((this.url).indexOf('messages') >= 0 || (this.url).indexOf('summary') >= 0) {
        adjestHeight = 120;
      } else {
        adjestHeight = 35;
      }
      document.getElementsByClassName('ui-table-wrapper')[0].setAttribute('style','height:' + ( window.innerHeight - (pHeight + mToolHeight + adjestHeight)) + 'px');
      document.getElementById('sideContentHideScroll').style.overflow = 'auto';
    });
  }


  ngAfterViewInit() {
    this.preloader.hide();
    const interval = setInterval(() => {
      if (document.getElementsByClassName('ui-table-wrapper')[0] !== undefined) {
        window.dispatchEvent(new Event('resize'));
        clearInterval(interval);
      }
    }, 1000);
  }
}
