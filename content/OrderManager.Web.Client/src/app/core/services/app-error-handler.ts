import { ErrorHandler, Inject, Injector, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AppErrorHandler extends ErrorHandler {
  constructor(@Inject(Injector) private injector: Injector) {
    super();
  }

  private get toastrService(): ToastrService {
    return this.injector.get(ToastrService);
  }

  public handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        this.toastrError(
          `Developers have been notified and will resolve this issue soon.`,
          `System Error`
        );
      } else {
        this.toastrError(error.error || error.message || 'error');
      }
    } else if (error instanceof TypeError) {
      this.toastrError(error.message, 'TypeScript Type error.');
    } else if (error instanceof Error) {
      this.toastrError(error.message);
    } else {
      this.toastrError('Something unexpected happened...');
    }
    super.handleError(error);
  }

  private toastrError(msg: string, title?: string) {
    this.toastrService.error(msg, title, {
      closeButton: true,
      timeOut: 5000,
      onActivateTick: true,
    });
  }
}
