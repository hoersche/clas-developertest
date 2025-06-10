import {Component, computed} from '@angular/core';
import {InternalRoute, ExternalLink, HeaderUser, UiowaHeaderModule} from '@uiowa/uiowa-header';
import {SessionExpirationAlert} from 'session-expiration-alert';
import {RouterOutlet} from '@angular/router';
import {AppFooterComponent} from "./core/components/app-footer/app-footer.component";
import {UserService} from "./core/services/user.service";
import {ImpersonationService} from "./core/services/impersonation.service";
import {ApplicationUser} from "./core/models/application-user";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [UiowaHeaderModule, RouterOutlet, AppFooterComponent, SessionExpirationAlert]
})
export class AppComponent  {
  applicationName = 'OrderManager';
  externalLinks = [
    new ExternalLink('Employee Self Service', 'https://hris.uiowa.edu/portal18')
  ];

  internalRoutes = computed<InternalRoute[]>(() => {
      const currentUser = this.userService.getCurrentUser();
      return this.setupNavMenus(currentUser);
    });

  user= computed<HeaderUser>(() => {
    const currentUser = this.userService.getCurrentUser()
    return {
      userName: currentUser.hawkId,
      originalUserName: currentUser.originalUser
    }
  });
  startTimer = computed(() => this.userService.getCurrentUser()?.isAuthenticated());


  constructor(
    private readonly userService: UserService,
    private readonly impersonationService: ImpersonationService
  ) {
  }
  
  setupNavMenus(user: ApplicationUser) {
    const internalRoutes = [];
    internalRoutes.push(new InternalRoute('Home', 'home'));
    if (user.isAuthenticated()) {
      internalRoutes.push(
        new InternalRoute('Orders', 'orders'),
        new InternalRoute('Another Page', 'other')
      );
    }
    if (user.isAdmin()) {
      internalRoutes.push(
        new InternalRoute('Impersonation', 'impersonation')
      );
    }

    return internalRoutes;
  }


  stopImpersonate() {
    this.impersonationService.stopImpersonate();
  }
}
