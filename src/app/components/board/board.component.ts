import { Component, OnInit } from '@angular/core';
import { NavmenuComponent } from '../navmenu/navmenu.component';
import { HeaderComponent } from '../header/header.component';
import { BackendApiService } from '../../services/backend-api.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    HeaderComponent,
    NavmenuComponent,
    TaskItemComponent,
    HttpClientModule,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {
    tasks:any = []
    constructor(
        private backend: BackendApiService,
        private http: HttpClient,
    ) {}

    async ngOnInit() {
        await this.getAllTasks();
        // throw new Error('Method not implemented.');
    }
    
    async getAllTasks() {
        // let resp = await this.getMyTasks();
        // console.log('Antwort: ', resp);
        this.backend.fetchAndLogTasks();
    }

    public getMyTasks(): Promise<any> {
        const url = environment.baseURL + "/tasks/";
        console.log('URL:', url);
        
        const headers = {headers:{'Content-Type':'application/json; charset=utf-8'}};
        
        return lastValueFrom(this.http.get(url));
    }

}
