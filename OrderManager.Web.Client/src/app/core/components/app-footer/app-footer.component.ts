import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './app-footer.component.html',
    styleUrls: ['./app-footer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class AppFooterComponent implements OnInit {
    year = 0;
    emailLinkText = 'CLAS IT';
    emailDistributionList = 'clas-technology-appdev@iowa.uiowa.edu';
    emailSubject = 'Questions about the OrderManager Website';
    emailHref: string;

    constructor() {
    }

    ngOnInit() {
        const today = new Date();
        this.year = today.getFullYear();
        this.emailHref = `mailto:${
            this.emailDistributionList
        }?subject=${this.emailSubject.replace(' ', '%20')}`;
    }
}
