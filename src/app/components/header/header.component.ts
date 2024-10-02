import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendApiService } from '../../services/backend-api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
    constructor(
        private router: Router,
        private backend: BackendApiService,
    ) {}

    logout() {
        this.backend.token = undefined;
        localStorage.removeItem("link-token");
        this.router.navigateByUrl('/login');
    }
}
