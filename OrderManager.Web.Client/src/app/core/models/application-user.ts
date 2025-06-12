export class ApplicationUser {
  /**
   * Application User View Model.
   */
  constructor(
    public hawkId: string = '',
    public originalUser?: string | null,
    public role: string = ''
  ) {}

  isAuthenticated(): boolean {
    return !!this.hawkId;
  }

  isBasicUser(): boolean {
    return (
      this.role === 'BasicUser' ||
      this.role === 'Admin' ||
      this.role === 'WebMaster'
    );
  }

  isAdmin(): boolean {
    return this.role === 'Admin' || this.role === 'WebMaster';
  }

  isWebMaster(): boolean {
    return this.role === 'WebMaster';
  }
}
