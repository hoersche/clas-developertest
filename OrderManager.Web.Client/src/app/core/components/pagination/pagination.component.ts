import {Component, input, model} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {faBackward, faFastBackward, faFastForward, faForward} from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css'],
    imports: [
        FaIconComponent,
        FormsModule
    ]
})
export class PaginationComponent {
    readonly currentPage = model.required<number>();
    readonly pageSize = model.required<number>();
    readonly totalPages = input<number>(null);
    identifier = input<string>("pagination");
    readonly firstPageIcon = faFastBackward;
    readonly previousPageIcon = faBackward;
    readonly nextPageIcon = faForward;
    readonly lastPageIcon = faFastForward;

    constructor() {
    }

    changePage(page: number) {
        const totalPages = this.totalPages();
        // if total pages was not passed used indeterminate page count
        if (!totalPages) {
            this.currentPage.set(page);
        }

        if (page >= 1 && page <= this.totalPages()) {
            this.currentPage.set(page)
        }
    }
}
