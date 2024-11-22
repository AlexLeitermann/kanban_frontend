import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Contact } from '../../models/contact.class';
import { FormsModule, NgForm } from '@angular/forms';
import { BackendApiService } from '../../services/backend-api.service';

@Component({
  selector: 'app-contact-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.scss'
})
export class ContactEditComponent {
    public dataContact: Contact | undefined = undefined;
    public dataEditContact: Contact = new Contact;
    disableForm: boolean = false;

    constructor(
        private backend: BackendApiService,
        public dialogRef: MatDialogRef<ContactEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.dataContact = this.data.selectedContact;
        this.dataEditContact = {...this.data.selectedContact};
    }

    closeDialog() {
        this.dataEditContact = new Contact;
        this.dialogRef.close();
    }

    onSubmit(form: NgForm) {
        if (form.submitted && form.valid) { this.saveForm(); }
    }

    async saveForm() {
        this.disableForm = true;
        await this.saveContact();
        this.disableForm = false;
    }

    async saveContact() {
        if (this.dataContact) {
            this.dataContact.name = this.dataEditContact.name;
            this.dataContact.initials = this.initialsFrom(this.dataEditContact.name);
            this.dataContact.email = this.dataEditContact.email;
            this.dataContact.phone = this.dataEditContact.phone;
            console.log('editContact - saveContactL', this.dataContact);
            this.backend.saveContact(this.dataContact).subscribe(() => {
                this.backend.initData();
            });
            // console.log('saveEditContact:', res);
            this.closeDialog();
            }
    }

    initialsFrom(name: string):string {
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
