import { Component, OnInit } from '@angular/core';
import { BackendApiService } from '../../services/backend-api.service';
import { HttpClientModule } from '@angular/common/http';
import { TaskItemComponent } from '../task-item/task-item.component';
import { Subscription } from 'rxjs';
import { Router, RouterLinkWithHref } from '@angular/router';
import { Task } from '../../models/task.class';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    TaskItemComponent,
    HttpClientModule,
    RouterLinkWithHref,
],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {
    public tasks:Task[] = [];
    private tasksSub = new Subscription();
    public taskTitles = ['Wartet', 'In Arbeit', 'Bewertung', 'Fertig'];

    constructor(
        public backend: BackendApiService,
        public route: Router,
    ) {}

    async ngOnInit() {
        this.tasksSub.add(
            this.backend.getTasksFromApi().subscribe((tasks) => { this.tasks = tasks })
        );
        console.log('OnInit - Board');
        
    }
    
    ngOnDestroy() {
        console.log('OnDestroy - Board');
        this.tasksSub.unsubscribe();
    }

    async getRoute(newRoute: any, status: number = 0) {
        if (newRoute == this.route.url) {
            // Reload current route
            this.route.navigateByUrl('/', {skipLocationChange:true})
            .then(()=>{
                this.route.navigate([`/${newRoute}`, status])
            });
        }
    }

}
