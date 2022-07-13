import { Component } from '@angular/core';
import { style } from '@angular/animations';

@Component({
  selector: 'app-user',
  template: `
  <a class="" mat-button="" routerlink="xpi/login" ng-reflect-router-link="xpi/login" href="xpi/login" tabindex="0" aria-disabled="false" style="color: black;line-height: 35px;box-shadow: 0px 0px 0px -1px rgba(0, 0, 0, 0.2), 0px -2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);border-radius: 0px;"><span class="mat-button-wrapper" style="
  text-transform: capitalize;
"><span class="matero-username" fxhide.lt-sm="" ng-reflect-fx-hide.lt-sm="" style="
  color:black;
  font-size: 14px;
  text-transform: capitalize !important;
">LogOut</span></span><div class="mat-button-ripple mat-ripple" matripple="" ng-reflect-centered="false" ng-reflect-disabled="false" ng-reflect-trigger="http://localhost:4200/#/login"></div><div class="mat-button-focus-overlay"></div></a>
  `,
})
export class UserComponent {}