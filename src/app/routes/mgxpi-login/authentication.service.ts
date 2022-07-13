import {
  Injectable
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  loginValue: number;
  unauthorizedAccessRedirect: string;

  constructor() {
    this.loginValue = -1;
    this.unauthorizedAccessRedirect = 'login';
  }

}
