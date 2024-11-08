import { Component } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';
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

    constructor(public route: Router) {}

    async getRoute(newRoute: any) {
        if (newRoute == this.route.url) {
            // Reload current route
            this.route.navigateByUrl('/', {skipLocationChange:false})
            .then(()=>{
                this.route.navigate([`/${newRoute}`]);
            });
        }
    }
}
