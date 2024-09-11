import {Component, EventEmitter, inject, Output} from '@angular/core';
import {UserService} from "../_services/user.service";
import {MessageService} from "../_services/message.service";
import {NgIf} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {IdentityEmailValidatorDirective} from "../_validation/identity-email-validator.directive";
import {IdentityPwdValidatorDirective} from "../_validation/identity-pwd-validator.directive";
import {RegexValidatorDirective} from "../_validation/regex-validator.directive";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgIf,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    IdentityEmailValidatorDirective,
    IdentityPwdValidatorDirective,
    RegexValidatorDirective
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent{
  username: string = "";
  password:string = "";
  password2:string = "";
  email:string = "";
  email2:string = "";
  private userService:UserService = inject(UserService);
  constructor(private messageService:MessageService) { }
  @Output() registered = new EventEmitter<String>();
  onRegister():void{
    this.userService.register(this.username,this.password,this.email)
      .subscribe((x) =>
      {
        console.log("->>>>>> "+x);
        if (x == "-1") this.username = this.password = this.password2 = this.email = this.email2 = "";
        else{
          this.registered.emit(this.username);
        }
      })
  }
}
