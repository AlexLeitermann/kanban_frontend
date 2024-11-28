import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {
    public registerData: any = [];
    public registerSuccess = false;
    disableForm: boolean = false;
    strongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

    constructor(
        private router: Router, 
        private http: HttpClient,
        private fb: FormBuilder
    ) {}

    backToLogin() {
        this.router.navigateByUrl('login');
    }

    onSubmit(ngForm: any) {
        this.convertRegisterData();
        this.disableForm = true;
        if (ngForm.submitted && ngForm.form.valid) { 
            this.register(); 
        } else {
            this.disableForm = false;
        }
    }

    registerFormFields = this.fb.group({
        formfirstname: ['', [Validators.required, Validators.pattern("[A-Za-z ÄäÖöÜüß\s\-]{2,}")]],
        formlastname: ['', [Validators.required, Validators.pattern("[A-Za-z ÄäÖöÜüß\s\-]{2,}")]],
        formemail: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9\.!%_\+\-]{1,64}[@][a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,6}")]],
        formnewpassword: ['', [Validators.required, Validators.pattern(this.strongPasswordRegx)]],
        formconfirmpassword: ['', [Validators.required, Validators.pattern(this.strongPasswordRegx)]]
    })

    convertRegisterData() {
        this.registerData.firstname = this.convertToString(this.registerFormFields.value.formfirstname);
        this.registerData.lastname = this.convertToString(this.registerFormFields.value.formlastname);
        this.registerData.email = this.convertToString(this.registerFormFields.value.formemail);
        this.registerData.newpassword = this.convertToString(this.registerFormFields.value.formnewpassword);
        this.registerData.confirmpassword = this.convertToString(this.registerFormFields.value.formconfirmpassword);
    }

    convertToString(value:any):string {
        return value ? value : "";
    }

    checkRegisterValidation(data = this.registerData) {
        let isValid = true;
        if( data.email == "") {isValid = false}
        if( data.firstname == "") {isValid = false}
        if( data.lastname == "") {isValid = false}
        if( data.newpassword == "" || 
            data.newpassword.length < 8) {isValid = false}
        if( data.confirmpassword == "" || 
            data.confirmpassword.length < 8 || 
            data.confirmpassword != data.newpassword) {isValid = false}
        return isValid;
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
            
            this.viewMsg();
        });
    }

    viewMsg() {
        this.registerSuccess = true;
        setTimeout(() => {
            this.disableForm = false;
            this.registerSuccess = false;
            this.backToLogin();
        }, 2500)
    }
}
