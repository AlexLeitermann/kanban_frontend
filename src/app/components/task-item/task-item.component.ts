import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BackendApiService } from '../../services/backend-api.service';
import { Task } from '../../models/task.class';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent {
    @Input() taskItem:Task = new Task;
    @Input() taskStatus:any = 0;

    constructor(private backend: BackendApiService) {}

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
            console.log('moveRight:', res);
            
        }
    }


}
