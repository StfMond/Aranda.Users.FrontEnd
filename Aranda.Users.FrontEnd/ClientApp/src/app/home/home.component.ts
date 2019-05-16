import { JwtHelper } from 'angular2-jwt';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: []
})
export class HomeComponent {
  user: any;
  constructor(private jwtHelper: JwtHelper, private router: Router) {
    let userStorage = localStorage.getItem("user");
    this.user = JSON.parse(userStorage);
  }

  isUserAuthenticated() {
    let token: string = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token))
      return true;

    return false;
  }

  isValidRol(action: any) {
    if (this.user.role.rolePermission.find(x => x.action === action) != null)
      return true;
    return false;
  }

}
