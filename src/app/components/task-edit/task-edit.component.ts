import { Component, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Task } from '../../models/task.class';
import { Contact } from '../../models/contact.class';
import { BackendApiService } from '../../services/backend-api.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Member } from '../../models/member';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.scss'
})
export class TaskEditComponent {
    public contacts: Contact[] = [];
    public dbContacts$: any;
    private contactsSub = new Subscription();

    public memberList: number[] = [];
    public members:Member[] = [];
    public dataTask: Task = new Task;
    public dataEditTask: Task = new Task;
    public disableForm: boolean = false;
    public viewedit: boolean = false;

    public taskTitles = ['Wartet', 'In Arbeit', 'Bewertung', 'Fertig'];

    public taskStatus!: number;

    constructor(
        private backend: BackendApiService,
        private route: ActivatedRoute,
        public dialogRef: MatDialogRef<TaskEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.dataTask = this.data.selectedTask;
        this.dataEditTask = {...this.data.selectedTask};
    }
    
    ngOnInit() {
        this.contactsSub = this.subContacts();
        this.getAllContacts();
        this.getMemberlist();
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

    isContactIDinMembers(contactID:number):boolean {
        const index:any = this.memberList.findIndex(c => {
            return c == contactID;
        });
        
        if (index !== -1) {
            return true;
        }
        return false;
    }

    getMemberlist() {
        if (this.dataEditTask.members == '') {
            this.dataEditTask.members = '[]';
        }
        this.memberList = JSON.parse(this.dataEditTask.members);
        const strMemberlist = JSON.parse(this.dataEditTask.members);
        strMemberlist.forEach((memberID: any) => {
            this.backend.getContactFromID(memberID)
            .then(res => {
                if (res !== false) {
                    this.members.push(new Member({'id': memberID, 'member': res}))
                }
            });
        });
        // this.isLoaded = true;
    }

    manageMembers(event: any, userID: number) {
        if (event.target.checked) {
            if (!this.memberList.includes(userID)) {
                this.memberList.push(userID);
            }
        } else {
            const memberIndex = this.memberList.indexOf(userID);
            if (memberIndex !== -1) {
                this.memberList.splice(memberIndex, 1);
            }
        }
    }

    toggleViewEdit() {
        this.viewedit = !this.viewedit;
    }

    closeDialog() {
        this.dialogRef.close()
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
        this.dataTask.title = this.dataEditTask.title;
        this.dataTask.description = this.dataEditTask.description;
        this.dataTask.color = this.dataEditTask.color;
        this.dataTask.status = this.dataEditTask.status;
        this.dataTask.priority = this.dataEditTask.priority;
        this.dataTask.members = JSON.stringify(this.memberList);
        this.backend.saveTask(this.dataTask).subscribe((res) => {
            // console.log('c.taskEdit - saveTask:', res);
            this.closeDialog();
        });
    }
    
    deleteTask() {
        this.backend.deleteTask(this.dataTask).subscribe((res) => {
            console.log('c.taskEdit - deleteTask:', res);
            this.closeDialog();
        });
        
    }

    moveRowLeft() {
        if (this.dataEditTask.status > 0) {
            this.dataEditTask.status--;
        }
    }

    moveRowRight() {
        if (this.dataEditTask.status < 3) {
            this.dataEditTask.status++;
        }
    }


}
