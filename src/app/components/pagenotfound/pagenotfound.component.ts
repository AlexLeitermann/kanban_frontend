import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BackendApiService } from '../../services/backend-api.service';

@Component({
  selector: 'app-pagenotfound',
  standalone: true,
  imports: [],
  templateUrl: './pagenotfound.component.html',
  styleUrl: './pagenotfound.component.scss'
})
export class PagenotfoundComponent {
    public isToken: boolean = false;

    constructor(private router: Router, public backend: BackendApiService) {
        this.isToken = this.backend.token == undefined ? false: true;
    }

    backToHome() {
        if (this.isToken) {
            this.router.navigateByUrl('/login');
        } else {
            this.router.navigateByUrl('/home/board');
        }
    }

}
