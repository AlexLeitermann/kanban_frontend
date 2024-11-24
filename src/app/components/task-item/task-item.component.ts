import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { BackendApiService } from '../../services/backend-api.service';
import { Task } from '../../models/task.class';
import { Member } from '../../models/member';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TaskEditComponent } from '../task-edit/task-edit.component';
import { BoardComponent } from '../board/board.component';

@Component({
    selector: 'app-task-item',
    standalone: true,
    imports: [
        CommonModule
    ],
    providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
     ],
    templateUrl: './task-item.component.html',
    styleUrl: './task-item.component.scss'
})
export class TaskItemComponent implements OnInit {
    @Input() taskItem:Task = new Task;
    @Input() taskStatus:any = 0;
    public members:Member[] = [];
    isLoaded = false;

    constructor(
        private backend: BackendApiService,
        private board: BoardComponent,
        public dialog: MatDialog,
        public dialogTaskEditRef: MatDialogRef<TaskEditComponent>
    ) {}

    ngOnInit(): void {
        this.getMemberlist();
    }
    
    async getMemberlist() {
        if (this.taskItem.members == '') {
            this.taskItem.members = '[]';
        }
        const strMemberlist = JSON.parse(this.taskItem.members);
        this.members = [];
        strMemberlist.forEach(async (memberID: number) => {
            this.backend.getContactFromID(memberID)
            .then(async res => {
                if (res !== false) {
                    this.members.push(new Member({'id': memberID, 'member': res}))
                } else {
                    await this.backend.removeMemberFromAllTasks(memberID);
                }
            });
        });
        this.isLoaded = true;
    }

    public convertDate(dateTimeData:Date) {
        return dateTimeData.toDateString;
    }

    moveTask(direction: 'left' | 'right'): void {
        if (
            (direction === 'left' && this.taskItem.status > 0) || 
            (direction === 'right' && this.taskItem.status < 3)
        ) {
            this.taskItem.status += direction === 'left' ? -1 : 1;
            this.backend.saveTask(this.taskItem).subscribe();
        }
    }

    moveRowLeft() {
        if (this.taskItem.status > 0) {
            this.taskItem.status--;
            this.backend.saveTask(this.taskItem).subscribe(() => {});
        }
    }

    moveRowRight() {
        if (this.taskItem.status < 3) {
            this.taskItem.status++;
            this.backend.saveTask(this.taskItem).subscribe(() => {});
        }
    }

    editTask() {
        if (this.taskItem) {
            this.dialogTaskEditRef = this.dialog.open(TaskEditComponent, {
                data: {
                    selectedTask: this.taskItem
                },
                panelClass: "dialogPanel",
                backdropClass: "dialogBackdropBackground"
            });
            this.dialogTaskEditRef.afterClosed().subscribe((result) => {
                this.backend.getTasksFromApi().subscribe(async (result) => {
                    this.board.tasks=result;
                    this.getMemberlist();
                });
            });
        }
    }


}
