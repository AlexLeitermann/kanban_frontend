import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BackendApiService } from '../../services/backend-api.service';
import { Task } from '../../models/task.class';
import { Member } from '../../models/member';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    DatePipe, CommonModule
  ],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent implements OnInit {
    @Input() taskItem:Task = new Task;
    @Input() taskStatus:any = 0;
    public members:Member[] = [];
    isLoaded = false;

    constructor(private backend: BackendApiService) {}

    ngOnInit(): void {
        this.getMemberlist();
    }
    
    getMemberlist() {
        if (this.taskItem.members == '') {
            this.taskItem.members = '[]';
        }
        const strMemberlist = JSON.parse(this.taskItem.members);
        // console.log('task-item', strMemberlist);
        strMemberlist.forEach((memberID: any) => {
            this.backend.getContactFromID(memberID)
            .then(res => {
                // console.log('task-item ' + memberID + ':', res);
                if (res !== false) {
                    this.members.push(new Member({'id': memberID, 'member': res}))
                }

            });
        });
        this.isLoaded = true;
    }

    public convertDate(dateTimeData:Date) {
        return dateTimeData.toDateString;
    }

    moveRowLeft() {
        if (this.taskItem.status > 0) {
            this.taskItem.status--;
            this.backend.saveTask(this.taskItem);
        }
    }

    moveRowRight() {
        if (this.taskItem.status < 3) {
            this.taskItem.status++;
            let res = this.backend.saveTask(this.taskItem);
        }
    }


}
