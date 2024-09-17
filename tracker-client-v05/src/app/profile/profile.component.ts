import { Component } from '@angular/core';
import {FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {UserService} from "../_services/user.service";
import {User} from "../_model/user";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(public userService:UserService) {
  }
  user:User = this.userService.user;
  profileForm:FormGroup = new FormGroup({
    systemData : new FormGroup({
      username : new FormControl(this.user.username, [Validators.required]),
      email : new FormControl(this.user.email, [Validators.required]),
    }),
    personalData : new FormGroup({
      firstName : new FormControl(this.user.firstName, [Validators.required]),
      lastName : new FormControl(this.user.lastName, [Validators.required]),
      sex : new FormControl(this.user.sex, [Validators.required]),
    }),
    addressData : new FormGroup({
      address : new FormControl(this.user.address, [Validators.required]),
      postalCode : new FormControl(this.user.postalCode, [Validators.required]),
      city : new FormControl(this.user.city, [Validators.required]),
      country : new FormControl(this.user.country, [Validators.required]),
    }),
  });
  onSubmit() {
    console.log(this.profileForm.value);
    this.user.username = this.profileForm.value.systemData.username;
    this.user.email = this.profileForm.value.systemData.email;
    this.user.firstName = this.profileForm.value.personalData.firstName;
    this.user.lastName = this.profileForm.value.personalData.lastName;
    this.user.sex  = this.profileForm.value.personalData.sex;
    this.user.address  = this.profileForm.value.addressData.address;
    this.user.postalCode  = this.profileForm.value.addressData.postalCode;
    this.user.city  = this.profileForm.value.addressData.city;
    this.user.country  = this.profileForm.value.addressData.country;
    console.log(JSON.stringify(this.user));
    this.userService.user = this.user;
    this.userService.update();
  }
}
