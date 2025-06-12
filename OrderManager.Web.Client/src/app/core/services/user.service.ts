import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {ApplicationUser} from "../models/application-user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly _user = signal(new ApplicationUser());
  

  constructor(private readonly httpClient: HttpClient) {
  }

  /**
   * Retrieves the current user without additional api calls
   */
  getCurrentUser = this._user.asReadonly();

  /**
   * Retrieves authenticated user from service and sets the current user
   */
  async authenticate(): Promise<ApplicationUser> {
    try {
      const u = await lastValueFrom(this.httpClient
        .get<ApplicationUser>('account/user'));

      if (u) {
        this._user.set(new ApplicationUser(
          u.hawkId,
          u.originalUser,
          u.role
        ));
      }

    } catch (e) {
      this._user.set(new ApplicationUser());
    }
    return this._user();
  }
}
