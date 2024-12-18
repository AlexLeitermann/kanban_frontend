import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
        private backend: BackendApiService,
    ) {
        let storeToken = localStorage.getItem('link-token') || "";
        if (storeToken != "") {
            this.backend.token = storeToken;
        }
    }


    ngOnInit(): void {
        this.checkForCurrentUser();
    }
    
    async checkForCurrentUser() {
        if (this.backend.currentUser.id == 0) {
            await this.backend.getUserFromToken(this.backend.token || "")
            .then((res) => {
                this.backend.currentUser.id = res.id;
                this.backend.currentUser.username = res.username;
                this.backend.currentUser.first_name = res.first_name;
                this.backend.currentUser.last_name = res.last_name;
                this.backend.currentUser.email = res.email;
            });
        }
        
    }
}
