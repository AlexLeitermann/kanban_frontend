import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { NavmenuComponent } from '../navmenu/navmenu.component';
import { BackendApiService } from '../../services/backend-api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    NavmenuComponent,
],
templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    constructor(
        private router: Router,
        private backend: BackendApiService,
    ) {
        let storeToken = localStorage.getItem('link-token') || "";
        if (storeToken != "") {
            this.backend.token = storeToken;
            // this.router.navigateByUrl('/home');
        }
    }


    ngOnInit(): void {
        this.checkForCurrentUser();
    }
    
    async checkForCurrentUser() {
        if (this.backend.currentUser.id == 0) {
            await this.backend.getUserFromToken(this.backend.token || "")
            .then((res) => {
                this.backend.currentUser.id = res.userid;
            });
        }
        
    }
}
