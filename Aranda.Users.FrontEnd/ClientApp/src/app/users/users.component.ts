import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent {
  users: User[];
  roles: Role[];
  selectedUser: User = ({
    name: '',
    fullName: '',
    address: '',
    telephone: '',
    email: '',
    age: 0,
    roleId: 1
  }) as any;
  filter: FilterUser = ({
    name: '',
    roleId: 0
  }) as any;
  globalUser: any;
  addUserComponent: boolean;
  editForm: boolean;

  constructor(private http: HttpClient, private router: Router) {
    let userStorage = localStorage.getItem("user");
    this.globalUser = JSON.parse(userStorage);
    this.getRoles();
    this.getUsers(null);
  }

  cleanUser() {
    this.selectedUser = ({
      name: '',
      fullName: '',
      address: '',
      telephone: '',
      email: '',
      age: 0,
      roleId: 1
    }) as any;
  }

  getRoles() {
    let token = localStorage.getItem("jwt");
    this.http.get<Role[]>("https://localhost:44390/api/Role", {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      })
    }).subscribe(response => {
      this.roles = response;
    }, error => console.error(error));
  }

  getUsers(filter: FilterUser) {
    let token = localStorage.getItem("jwt");
    let userFilter = JSON.stringify(filter);
    this.http.get<User[]>("https://localhost:44390/api/User", {
      headers: new HttpHeaders(({
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
        "User": userFilter
      }) as any)
    }).subscribe(response => {
      this.users = response;
    }, error => console.error(error));
  }

  isValidRol(action: any) {
    if (this.globalUser.role.rolePermission.find(x => x.action === action) != null)
      return true;
    return false;
  }

  editUser(id: number) {
    this.selectedUser = this.users[id];
    this.editForm = true;
    this.addUserComponent = true;
  }

  update() {
    let token = localStorage.getItem("jwt");
    let idx = this.selectedUser.id;
    let user = JSON.stringify(this.users.find(x => x.id === idx));
    console.log(user);
    this.http.put("https://localhost:44390/api/User", user, {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      })
    }).subscribe(response => {
      this.users[this.users.indexOf((user) as any)] = <User>(response);
      this.addUserComponent = false;
    }, error => console.error(error));
  }

  remove(idx: number, id: any) {
    let token = localStorage.getItem("jwt");
    this.http.delete("https://localhost:44390/api/User/" + id, {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      })
    }).subscribe(response => {
      this.users.splice(idx, 1);
    }, error => console.error(error));
  }

  addForm() {
    this.addUserComponent = !this.addUserComponent;
    this.editForm = false;
    this.cleanUser();
  }

  save() {
    if (this.editForm)
      this.update();
    else
      this.add();
  }

  add() {
    let token = localStorage.getItem("jwt");
    let user = JSON.stringify(this.selectedUser);
    this.http.post("https://localhost:44390/api/User", user, {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      })
    }).subscribe(response => {
      this.users.push((response) as any);
      this.addUserComponent = false;
    }, error => console.error(error));
  }

  filterUser() {
    console.log(this.filter);
    this.getUsers(this.filter);
    this.filter = ({
      name: '',
      roleId: 0
    }) as any;
  }
}

interface User {
  id: number;
  name: string;
  fullName: string;
  address: string;
  telephone: string;
  email: string;
  age: number;
  roleId: number;
}

interface FilterUser {
  name: string;
  roleId: number;
}

interface Role {
  id: number;
  name: string;
}
