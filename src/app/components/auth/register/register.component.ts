import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
    public registerData: any = [];

    constructor(
        private router: Router, 
        private http: HttpClient,
    ) {}

    backToLogin() {
        this.router.navigateByUrl('login');
    }

    onSubmit(form: NgForm) {
        if (form.submitted && form.valid) { 
            this.register(); 
        }
    }

    getHeaders(): any {
        return {
            headers: {
                'Content-Type':'application/json',
                'Accept':'application/json',
            }
        };
    }

    register() {
        const url = environment.baseURL + "/register/";
        const sendData = {
            'username': this.registerData.email,
            'firstname': this.registerData.firstname,
            'lastname': this.registerData.lastname,
            'email': this.registerData.email,
            'newpassword': this.registerData.newpassword,
            'confirmpassword': this.registerData.confirmpassword
        };
        this.http.post<any>(url, sendData, this.getHeaders()).subscribe(()=>{
            this.backToLogin();
        });
    }
}
