import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateFn} from '@angular/router';
import {UserService} from '../services/user.service';
import {LoginService} from '@uiowa/uiowa-header';

export const RoleGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router: Router = inject(Router)
  const userService = inject(UserService);
  const loginService = inject(LoginService);

  const roles = (route.data.roles || []) as Array<string>;
  const u = userService.getCurrentUser()
  loginService.returnUri = state.url;
  
  if (!u.isAuthenticated()) {
    await router.navigateByUrl('');
    return false;
  }
  if (!roles.includes(u.role)) {
    await router.navigateByUrl('/access-denied');
    return false;
  }
  
  return true;

}
