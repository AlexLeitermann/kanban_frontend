import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { BackendApiService } from '../../services/backend-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
    public profileOpener = false;
    public currentProfile:any;
    public isLoaded = false;

    constructor(
        private router: Router,
        private backend: BackendApiService,
    ) {
        this.backend.fetchCurrentUser().then(() => {
            const { first_name, last_name } = this.backend.currentUser;
            this.currentProfile = `${first_name} ${last_name}`;
            this.isLoaded = true;
        });
    }

    profileOpen() {
        this.profileOpener = !this.profileOpener;
    }

    logout() {
        this.backend.token = undefined;
        localStorage.removeItem("link-token");
        this.router.navigateByUrl('/login');
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const clickedElement = event.target as HTMLElement;
        const isProfileMenuClick = clickedElement.closest('.profilemenu-opener') !== null;
        if (!isProfileMenuClick && this.profileOpener) {
            this.profileOpener = false;
        }
    }
}
