import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavmenuComponent } from '../navmenu/navmenu.component';
import { HeaderComponent } from '../header/header.component';
import { BackendApiService } from '../../services/backend-api.service';
import { HttpClientModule } from '@angular/common/http';
import { TaskItemComponent } from '../task-item/task-item.component';
import { Subscription } from 'rxjs';
import { Router, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    HeaderComponent,
    NavmenuComponent,
    TaskItemComponent,
    HttpClientModule,
    RouterLinkWithHref,
],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit, OnChanges {
    public tasks:any[] = [];
    private tasksSub = new Subscription();

    public dbTasks$: any;
    public taskTitles = ['Wartet', 'In Arbeit', 'Bewertung', 'Fertig'];

    constructor(
        public backend: BackendApiService,
        public route: Router,
    ) {}

    async ngOnInit() {
        this.tasksSub = this.subTasks();
        this.getAllTasks();
    }

    ngOnDestroy() {
        this.tasksSub.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.getAllTasks();
    }

    subTasks(): Subscription {
        return this.backend.tasks$.subscribe( (tasks) => {
            this.tasks = tasks;
        });
    }
    
    getAllTasks() {
        this.backend.getTasksFromApi().subscribe(async (result) => {
            this.dbTasks$=result;
        });
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
