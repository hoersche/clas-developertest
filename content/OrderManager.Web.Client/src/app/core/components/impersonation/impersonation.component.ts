import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ImpersonationService } from '../../services/impersonation.service';
import { FormsModule } from '@angular/forms';

import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-impersonation',
    templateUrl: './impersonation.component.html',
    styleUrls: ['./impersonation.component.css'],
    imports: [NgbAlert, FormsModule]
})
export class ImpersonationComponent implements OnInit {
  hawkId: string;
  constructor(
    public readonly userService: UserService,
    private readonly impersonationService: ImpersonationService
  ) {}

  ngOnInit() {}
  impersonate() {
    if (!this.hawkId) {
      return;
    }
    this.impersonationService.impersonate(this.hawkId);
  }

  stopImpersonate() {
    this.impersonationService.stopImpersonate();
  }
}
