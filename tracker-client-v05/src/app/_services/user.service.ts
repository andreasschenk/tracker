import {Injectable, Optional, SkipSelf} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of, tap} from "rxjs";
import {User} from "../_model/user";
import {MessageService} from "./message.service";
import {ConfigService} from "./config.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user : User = new User();
  constructor(private http: HttpClient, private messageService:MessageService,
              private configService:ConfigService, private router:Router) {
    if (!this.user.isLoggedIn)
    {
      let s : string = sessionStorage.getItem("user") ?? "";
      if (s.length > 0)
        this.user = JSON.parse(s) as User;
    }
  }
  isLoggedIn() : boolean {
    //console.log(this.user.username + "is logged in: " + this.user.isLoggedIn)
    return this.user.isLoggedIn;
  }

  login(username:string, password:string):Observable<User>{
    return this.http.post<User>(this.configService.serverUrl+"/users/login/", {username:username,password:password})
      .pipe(
        catchError(this.configService.handleError<User>('login',undefined)),
        tap((x) =>
        {
          if (x != null)
          {
            this.user = x;
            this.user.isLoggedIn = true;
            sessionStorage.setItem("user", JSON.stringify(this.user));
            //console.log("+++++ " + JSON.stringify(this.user));
          }
        }));
  }
  register(username:string, password:string, email:string):Observable<string>{
    let obs:Observable<string> = this.http.post<string>(this.configService.serverUrl+"/users/register/",
        {username:username, password:password, email:email})
      .pipe(catchError(this.configService.handleError<string>('register',"-1")));
    return obs;
  }

  update() : void {
    console.log("service update user ::: " + JSON.stringify(this.user));
    this.http.put<User>(this.configService.serverUrl+"/users/update/",this.user)
      .pipe(catchError(this.configService.handleError<void>("update")))
      .subscribe(() => {});
  }

  logout():void{
    this.user = new User();
    sessionStorage.clear();
    this.router.navigate(['/']).then(x => console.log(x)) ;
  }
}
