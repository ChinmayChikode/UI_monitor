import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  BrowserModule
} from '@angular/platform-browser';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse
} from '@angular/common/http';
import {
  Router
} from '@angular/router';
import {
  AuthenticationService
} from './authentication.service';
import { DomSanitizer } from '@angular/platform-browser';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';

@Component({
  selector: 'app-login-component',
  templateUrl: './mgxpi-login.component.html',
  styleUrls: ['./mgxpi-login.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('in', style({ 'opacity': '1' })),
      state('out', style({ 'opacity': '0' })),
      transition('* => *', [
        animate(2000)
      ])
    ])
  ]
})
export class MgxpiLoginComponent implements OnInit {

  accessToken: string;
  allowDenyflag: boolean;
  radio: string;
  resourceAccessResponse: string;
  showPassword = false;
  email: string;
  usd: number;
  comment: string;
  commentMax = 200;

  private bgImgs: Array<any>;
  private current: number = 0;
  currentImage;
  state = 'in';
  counter = 0;
  enableAnimation = false;

  @Input()
  username: string;

  @Input()
  password: string;

  constructor(private sanitize: DomSanitizer,private http: HttpClient, public navigation: Router, public authentication: AuthenticationService) {
    this.bgImgs = ['/assets/background_2.jpg', '/assets/background_3.jpg', '/assets/background_4.jpg', '/assets/background_5.jpg'];
    this.currentImage = this.bgImgs[0];
  }

  get passwordType() {
    return this.showPassword ? 'text' : 'password';
  }

  get passwordToggleLabel() {
    return this.showPassword ? 'Hide password' : 'Reveal password';
  }

  get passwordToggleIcon() {
    return this.showPassword ? 'visibility_off' : 'visibility';
  }

  login(username: any, password: any) {

    localStorage.setItem('currentUserName', username);

    const tokenHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic RnVsbGV0cm9uOk1hZ2ljU2VjdXJlZEZ1bGxldHJvbg==',
      Accept: 'application/json'
    });

    let body = 'client_id=Fulletron' +
      '&client_secret=MagicSecuredFulletron' +
      '&username=FulletronIndia' +
      '&password=FulletronAuthentication' +
      '&grant_type=password' +
      '&scope=openid';

    console.log(username);
    console.log(password);

    if (username == 'admin' && password == 'changeit') {

      console.log('Yes Bank');
      console.log(tokenHeaders.get('Content-Type'));
      console.log(tokenHeaders.get('Authorization'));
      console.log('Body :' + body);

      this.http.post('http://localhost:8081/magicxpi/oauth/token', body, {
          headers: tokenHeaders
        })
        .subscribe(
          (tokenResponse: any) => {
            console.log(tokenResponse);
            this.accessToken = tokenResponse.access_token;
            console.log('Access Token : ' + this.accessToken);
            localStorage.setItem('currentUserToken', tokenResponse.access_token);
            if (this.accessToken !== localStorage.getItem('currentUserToken')) {
              console.log('In Token Equality Check' + localStorage.getItem('currentUserToken'));
              this.allowDenyflag = false;
            } else {
              this.allowDenyflag = true;
            }
            this.authorize();
          },
          (errorResponse: any) => {
            if (errorResponse.name == 'HttpErrorResponse' && errorResponse['status'] == 0) {
              this.navigation.navigateByUrl('/ServerDown');
            }
          }
        );
    }
  }

  authorize() {
    console.log('In Authorize method Auth Token : ' + this.accessToken);
    if (this.allowDenyflag == true) {

      const resourceHeaders = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + localStorage.getItem('currentUserToken'),
        Accept: 'application/json'
      });

      console.log('Authorization : ' + resourceHeaders.get('Authorization'));

      const options = {
        resourceHeaders,
        responseType: 'text' as 'text'
      };

      this.http.get('http://localhost:8082/resource', {
          headers: resourceHeaders,
          responseType: 'text'
        })
        .subscribe(
          resourceResponse => {
            console.log('Response From Server : ' + resourceResponse);
            if (resourceResponse.search('Successful') == -1) {
              console.log('Not found');
            } else {
              console.log('found');
              this.authentication.loginValue = 1;
              this.navigation.navigateByUrl('/xpi/dashboard');
            }
          },
          (errorResponse: any) => {
            if (errorResponse.name == 'HttpErrorResponse' && errorResponse['status'] == 0) {
              this.navigation.navigateByUrl('/ServerDown');
            }
          }
        );
    } else {
      console.log('Access Denied');
      this.authentication.unauthorizedAccessRedirect = 'AccessDenied';
      setTimeout(function() {
        window.location.reload();
      }, 5000);
    }
  }

  checkLoginError() {
    console.log('Checking Error');
    this.authentication.loginValue = -1;
    this.authentication.unauthorizedAccessRedirect = '';
  }

  /* tempLogin(event: any, inputName: any, inputPassword: any){

    var inputName = inputName.value;
    var inputPassword = inputPassword.value;

    if (inputName == "admin" && inputPassword == "changeit") {
      this.allowDenyflag = true;
      this.navigation.navigateByUrl("/MagicDashboard");
    }
  } */

  ngOnInit() {
    Observable.interval(10000)
      .subscribe(x => {
        this.runAnimation();
      })
  }

  runAnimation() {
    this.enableAnimation = true;
    this.counter = 0;
    this.toggleState();
  }

  toggleState() {
    if (this.counter < 2) {
      this.state = this.state === 'in' ? 'out' : 'in';
      this.counter++;
    }
  }

  onDone($event) {
    if (this.enableAnimation) {
      if (this.counter === 1) {
        this.toggleImg();
      }
      this.toggleState();
    }
  }

  toggleImg() {
    this.currentImage = this.sanitize.bypassSecurityTrustStyle(`url(${this.bgImgs[this.current]})`);
    this.current == this.bgImgs.length - 1 ? (this.current = 0) : ++this.current;
  }

}
