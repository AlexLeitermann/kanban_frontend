import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Contact } from '../../models/contact.class';
import { FormsModule, NgForm } from '@angular/forms';
import { BackendApiService } from '../../services/backend-api.service';

@Component({
  selector: 'app-addcontact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './addcontact.component.html',
  styleUrl: './addcontact.component.scss'
})
export class AddcontactComponent {
    public dataContact: Contact = new Contact;
    public dataAddContact: Contact = new Contact;
    disableForm: boolean = false;

    constructor(
        private backend: BackendApiService,
        public dialogRef: MatDialogRef<AddcontactComponent>,
    ) {
    }

    closeDialog() {
        this.dataAddContact = new Contact;
        this.dialogRef.close();
    }

    onSubmit(form: NgForm) {
        if (form.submitted && form.valid) { 
            console.log('AddContact - onSubmit');
            this.saveForm(); 
        }
    }

    async saveForm() {
        this.disableForm = true;
        await this.saveContact();
        this.disableForm = false;
    }

    async saveContact() {
        this.dataContact.name = this.dataAddContact.name;
        this.dataContact.initials = this.initialsFrom(this.dataAddContact.name);
        this.dataContact.email = this.dataAddContact.email;
        this.dataContact.phone = this.dataAddContact.phone;
        let res = this.backend.createContact(this.dataContact);
        console.log('saveAddContact:', res);
        this.closeDialog();
    }

    initialsFrom(name: string):string {
        console.log('initialsFrom:', name);
        if (name.toLowerCase() == "guest" || name.toLowerCase() == "gast") {
            return "G";
        } else {
            let wordlist = name.split(" ");
            let words = wordlist.length;
            let result = "--";
            if (words == 1) {
                result = wordlist[0][0];
                result += wordlist[0].length > 1 ? wordlist[0][1] : "-";
            } else if (words > 1) {
                result = wordlist[0][0] + wordlist[1][0];
            }
            return result.toUpperCase();
        }
    }

}
