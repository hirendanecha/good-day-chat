import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Subject } from 'rxjs';
import { ToastService } from './toast.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Socket } from 'socket.io-client';
import { SocketService } from './socket.service';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  isUserAuthenticated: Subject<boolean> = new BehaviorSubject<boolean>(false);
  public _credentials: any = {};

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private toastService: ToastService,
    private socketService: SocketService
  ) { }

  signOut(): void {
    sessionStorage.clear();
    const theme = localStorage.getItem('theme');
    localStorage.clear();
    this.cookieService.delete('auth-user', '/', environment.domain);
    // this.cookieService.deleteAll('/');
    localStorage.setItem('theme', theme);
    this.toastService.success('Successfully Logged Out');
    this.router.navigate(['/']);
  }

  public saveToken(token: string): void {
    // sessionStorage.removeItem(TOKEN_KEY);
    // localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    // return localStorage.getItem(TOKEN_KEY);
    return localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    const userStr = JSON.stringify(user);

    // sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_KEY);

    localStorage.setItem(USER_KEY, userStr);
    // localStorage.setItem(USER_KEY, userStr);
  }

  public getUser(): any {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }

  getCredentials(): any {
    // this._credentials = this.getUser();
    // const isAuthenticate = Object.keys(this._credentials || {}).length > 0;
    const token = this.getToken();
    const isAuthenticate = token ? true : false;
    this.changeIsUserAuthenticated(isAuthenticate);
    return isAuthenticate;
  }

  changeIsUserAuthenticated(flag: boolean = false) {
    this.isUserAuthenticated.next(flag);
  }

  clearLoginSession(profileId): void {
    this.socketService.logout(
      { profileId: profileId, token: this.getToken() },
      (data) => {
        return;
      }
    );
  }
}
