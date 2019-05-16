import { Component } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  user: any;
  constructor(private router: Router) {
    let userStorage = localStorage.getItem("user");
    this.user = JSON.parse(userStorage);
  }


  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logOut() {
    localStorage.removeItem("jwt");
    this.router.navigate(["login"]);
  }

  isValidRol(action: any) {
    if (this.user.role.rolePermission.find(x => x.action === action) != null)
      return true;
    return false;
  }
}
