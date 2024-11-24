import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Contact } from '../../models/contact.class';
import { BackendApiService } from '../../services/backend-api.service';
import { Subscription } from 'rxjs';
import { AddcontactComponent } from '../addcontact/addcontact.component';
import { ContactEditComponent } from '../contact-edit/contact-edit.component';

@Component({
    selector: 'app-contacts',
    standalone: true,
    imports: [
        MatDialogModule,
    ],
    providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
     ],
    templateUrl: './contacts.component.html',
    styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit, OnChanges {
    public contacts: Contact[] = [];
    private contactsSub = new Subscription();
    public singleContact: Contact | undefined = undefined;

    constructor(
        private backend: BackendApiService,
        public dialogContactEditRef: MatDialogRef<ContactEditComponent>,
        public dialogContactAddRef: MatDialogRef<AddcontactComponent>,
        public dialog: MatDialog,
    ) {}

    async ngOnInit() {
        this.contactsSub = this.subContacts();
        this.getAllContacts();
    }

    ngOnDestroy() {
        this.contactsSub.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.getAllContacts();
    }

    subContacts(): Subscription {
        return this.backend.contacts$.subscribe( (contacts) => {
            this.contacts = contacts;
        });
    }
    
    getAllContacts() {
        this.backend.getContactsFromApi().subscribe((result) => {
            this.contacts = result;
        });
    }

    viewSelectedContact(index:number) {
        this.singleContact = new Contact(this.contacts[index]);
    }

    editContact() {
        if (this.singleContact) {
            this.dialogContactEditRef = this.dialog.open(ContactEditComponent, {
                data: {
                    selectedContact: this.singleContact
                },
                panelClass: "dialogPanel",
                backdropClass: "dialogBackdropBackground"
            });
            this.dialogContactEditRef.afterClosed().subscribe(() => {
            });
        }
    }

    async delContact() {
        if (this.singleContact) {
            await this.backend.removeMemberFromAllTasks(this.singleContact.id);
            this.backend.deleteContact(this.singleContact).subscribe({
                next: () => {
                    this.singleContact = undefined;
                    this.getAllContacts();
                },
                error: error => {
                    console.error('contacts.comp.ts - delContact - error:', error);
                }
            });
        }
    }

    addContact() {
        this.dialogContactAddRef = this.dialog.open(AddcontactComponent, {
            panelClass: "dialogPanel",
            backdropClass: "dialogBackdropBackground"
        });
        this.dialogContactAddRef.afterClosed().subscribe(() => {
            this.getAllContacts();
        });
    }

}
