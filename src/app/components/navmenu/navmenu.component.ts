import { Component } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';
import { BackendApiService } from '../../services/backend-api.service';
import { BoardComponent } from '../board/board.component';

@Component({
    selector: 'app-navmenu',
    standalone: true,
    imports: [
        RouterLinkWithHref,
    ],
    providers:    [
        BoardComponent
    ],
    templateUrl: './navmenu.component.html',
    styleUrl: './navmenu.component.scss'
})
export class NavmenuComponent {

    constructor(public route: Router,private backend: BackendApiService,private board: BoardComponent) {}

    async getRoute(newRoute: any) {
        if (newRoute == this.route.url) {
            this.board.getAllTasks();
            window.location.reload();
        }
    }
}
