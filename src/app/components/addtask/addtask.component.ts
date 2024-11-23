import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Contact } from '../../models/contact.class';
import { Subscription } from 'rxjs';
import { BackendApiService } from '../../services/backend-api.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Task } from '../../models/task.class';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-addtask',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './addtask.component.html',
  styleUrl: './addtask.component.scss'
})
export class AddtaskComponent implements OnInit {
    public contacts: Contact[] = [];
    public dbContacts$: any;
    private contactsSub = new Subscription();

    public members: number[] = [];
    public membersDropDown = false;
    public dataTask: Task = new Task;
    public dataAddTask: Task = new Task;
    public disableForm: boolean = false;

    public taskTitles = ['Wartet', 'In Arbeit', 'Bewertung', 'Fertig'];

    public taskStatus!: number;
    myParam!: string;

    constructor(
        private backend: BackendApiService,
        private route: ActivatedRoute,
        public newRoute: Router,
    ) {
        this.getUrlParam();
    }
    
    ngOnInit() {
        this.getUrlParam();
        this.contactsSub = this.subContacts();
        this.getAllContacts();
    }
    
    getUrlParam(): void {
        const paramStatus = this.route.snapshot.paramMap.get('status');
        this.taskStatus = paramStatus != undefined ? +paramStatus : 0;
        if (this.taskStatus > 2) {
            this.taskStatus = 2;
        }
        this.dataAddTask.status = this.taskStatus;
    }

    ngOnDestroy() {
        this.contactsSub.unsubscribe();
    }

    subContacts(): Subscription {
        return this.backend.contacts$.subscribe( (contacts) => {
            this.contacts = contacts;
        });
    }
    
    getAllContacts() {
        this.backend.getContactsFromApi().subscribe(async (result) => {
            this.dbContacts$ = result;
            this.contacts = result;
        });
    }

    getInitialsFromID(contactID:number) {
        const index:any = this.contacts.findIndex(c => {
            return c.id == contactID;
        });
        if (index !== -1) {
            return this.contacts[index].initials;
        }
        return "--";
    }

    getNameFromID(contactID:number) {
        const index:any = this.contacts.findIndex(c => {
            return c.id == contactID;
        });
        if (index !== -1) {
            return this.contacts[index].name;
        }
        return "--";
    }

    toggleDropDown() {
        this.membersDropDown = !this.membersDropDown;
    }

    manageMembers(event: any, userID: number) {
        if (event.target.checked) {
            if (!this.members.includes(userID)) {
                this.members.push(userID);
            }
        } else {
            const memberIndex = this.members.indexOf(userID);
            if (memberIndex !== -1) {
                this.members.splice(memberIndex, 1);
            }
        }
    }

    onSubmit(form: NgForm) {
        if (form.submitted && form.valid) { 
            this.saveForm(); 
        }
    }

    async saveForm() {
        this.disableForm = true;
        await this.saveTask();
        this.disableForm = false;
    }

    async saveTask() {
        this.dataTask.title = this.dataAddTask.title;
        this.dataTask.description = this.dataAddTask.description;
        this.dataTask.color = this.dataAddTask.color;
        this.dataTask.status = this.dataAddTask.status;
        this.dataTask.priority = this.dataAddTask.priority;
        this.dataTask.members = JSON.stringify(this.members);
        this.dataTask.author.id = this.backend.currentUser.id;
        this.backend.createTask(this.dataTask).subscribe((res: any) => {
            this.newRoute.navigate([`/home/board`])
        });
    }

    moveRowLeft() {
        if (this.dataAddTask.status > 0) {
            this.dataAddTask.status--;
        }
    }

    moveRowRight() {
        if (this.dataAddTask.status < 3) {
            this.dataAddTask.status++;
        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const clickedElement = event.target as HTMLElement;
        const isDropDownClick = clickedElement.closest('.members-add-btn') !== null;
        const isMemberCheckboxClick = clickedElement.closest('.memberCheckbox') !== null;
        if (!(isDropDownClick || isMemberCheckboxClick) && this.membersDropDown) {
            this.membersDropDown = false;
        }
    }

}
