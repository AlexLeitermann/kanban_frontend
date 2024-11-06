import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { BackendApiService } from '../../../services/backend-api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
    public dataLogin: any = [];
    public resMessage: string = "";
    public errMail: boolean = false;

    constructor(
        private router: Router,
        private backend: BackendApiService,
    ) {
        let storeToken = localStorage.getItem('link-token') || "";
        if (storeToken != "") {
            this.backend.token = storeToken;
            this.router.navigateByUrl('/home');
        }
    }

    onSubmit(form: NgForm) {
        if (form.submitted && form.valid) { 
            this.login(); 
        }
    }

    async login() {
        await this.backend.loginOnApi(this.dataLogin.username, this.dataLogin.password)
        .then((res) => {
            console.log('login-after', res);
            this.backend.token = res.token;
            this.backend.currentUser.id = res.userid;
            this.backend.getCurrentUserFromID(res.userid);
            localStorage.setItem('link-token', res.token);
            this.router.navigateByUrl('/home');
        })
        .catch((err) => {
            console.error('Login-Fehler: ',err);
            this.errMail = true;
            setTimeout(()=>{this.errMail=false;},4000);
        })
        
    }

    navToRegister() {
        this.router.navigateByUrl('register');
    }
}
