import { Injectable } from '@angular/core';
import {User} from "../_model/user";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: string[] = [];
  constructor() {
    //console.log("------------ messageservice constructed!!!")
    let s : string = sessionStorage.getItem("messages") ?? "";
    if (s.length > 0)
      this.messages = JSON.parse(s) as string[];

  }
  add(message: string){
    this.messages.push(message);
    sessionStorage.setItem("messages", JSON.stringify(this.messages));
  }
  clear(){
    this.messages = [];
    sessionStorage.setItem("messages", JSON.stringify(this.messages));
  }
}
