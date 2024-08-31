import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BackendApiService implements OnInit {
    tasks:any = [];

    constructor(private http: HttpClient) {}

    ngOnInit(): void {}
    
    public getTasks(): Observable<any> {
        const url = environment.baseURL + "/tasks/";
        console.log('URL:', url);
        const headers = {headers:{
            'Content-Type':'application/json',
            'Accept':'application/json',
        }};
        
        return this.http.get<any>(url, headers);
    }

    public loginOnBackend(username: string, password: string): Promise<any> {
        const url = environment.baseURL + "/login/";
        const body ={
            "username": username,
            "password": password
        };
        const headers = {headers:{'Content-Type':'application/json; charset=utf-8'}};
        
        return lastValueFrom(this.http.post<any>(url,body,headers));
    }

    public getTasksInRow(row:any):any {
        return this.tasks.filter(this.tasks.status == row);
    }

    fetchAndLogTasks(): void {
        this.getTasks().subscribe(
            (data) => {
                console.log('Empfangene Daten:', data);
            },
            (error) => {
                console.error('Fehler beim Abrufen der Daten:', error);
            }
        );
    }

}
