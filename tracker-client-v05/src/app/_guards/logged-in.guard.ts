import {inject} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import {UserService} from "../_services/user.service";
import {MessageService} from "../_services/message.service";

export const loggedInGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  let res:boolean = inject(UserService).isLoggedIn();
  //inject(MessageService).add("loggedIn: " + res);
  return res;
};
