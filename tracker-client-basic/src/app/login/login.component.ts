import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {UserService} from "../_services/user.service";
import {MessageService} from "../_services/message.service";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {Router} from "@angular/router";
import {User} from "../_model/user";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
    imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        NgIf
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Input() username : string = "";
  password : string = "";
  constructor(private userService:UserService,
              private messageService:MessageService, private router:Router) {
  }
  @Output() loggedIn = new EventEmitter<User>();
  onLogin():void{
    this.userService.login(this.username, this.password)
      .subscribe((x) =>
      {
        if (x == undefined) this.username = this.password = "";
        else{
          localStorage.setItem('tracker_last_user',this.username);
          this.loggedIn.emit(x);
        }
      })
  }
}
