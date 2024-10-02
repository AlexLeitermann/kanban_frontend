import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject, lastValueFrom, Observable, of } from 'rxjs';
import { Contact } from '../models/contact.class';
import { Task } from '../models/task.class';

@Injectable({
    providedIn: 'root'
})
export class BackendApiService implements OnInit {
    private tasksSubject = new BehaviorSubject<any[]>([]);
    private contactSubject = new BehaviorSubject<any[]>([]);
    tasks: Task[] = [];
    contacts: Contact[] = [];
    tasksObservable$:any;
    contactsObservable$:any;

    apiHeaders = {headers:{
        'Content-Type':'application/json',
        'Accept':'application/json',
    }};

    public tasks$ = this.tasksSubject.asObservable();
    public contacts$ = this.contactSubject.asObservable();
    public token: string | undefined = undefined;

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.getContactsFromApi().subscribe((item) => {
            this.contacts = item;
            // console.log('backend.service - ngOnInit - getContacts', item);
            
        });
    }

    getHeadersWithToken(): any {
        return {
            headers: {
                ...this.apiHeaders.headers,
                'Authorization': 'Token ' + this.token
            }
        };
    }
    
    // #####################################################################################################
    // ----- API's -----------------------------------------------------------------------------------------
    // #####################################################################################################
    // ----- GET's -----------------------------------------------------------------------------------------
    // #####################################################################################################
    
    getTasksFromApi(): Observable<any> {
        const url = environment.baseURL + "/tasks/";
        return this.http.get<any>(url, this.getHeadersWithToken());
    }
    
    getContactsFromApi(): Observable<any> {
        const url = environment.baseURL + "/contacts/";
        return this.http.get<any>(url, this.getHeadersWithToken());
    }
    
    getUsersFromApi(): Observable<any> {
        const url = environment.baseURL + "/users/";
        return this.http.get<any>(url, this.getHeadersWithToken());
    }
    
    // #####################################################################################################
    // ----- POST's -----------------------------------------------------------------------------------------
    // #####################################################################################################
    
    postTaskToApi(taskData:any) {
        const url = environment.baseURL + "/tasks/";
        return this.http.post<any>(url, taskData, this.getHeadersWithToken());
    }
    
    postContactToApi(contactData:any) {
        const url = environment.baseURL + "/contacts/";
        return this.http.post<any>(url, contactData, this.getHeadersWithToken());
    }
    
    postUserToApi(userData:any) {
        const url = environment.baseURL + "/users/";
        return this.http.post<any>(url, userData, this.apiHeaders);
    }
    
    // #####################################################################################################
    // ----- PUT's -----------------------------------------------------------------------------------------
    // #####################################################################################################
    
    putTaskToApi(taskData:any, taskID:number) {
        const url = environment.baseURL + "/tasks/" + taskID + "/";
        return this.http.put<any>(url, taskData, this.getHeadersWithToken());
    }
    
    putContactToApi(contactData:any, contactID:number) {
        const url = environment.baseURL + "/contacts/" + contactID + "/";
        return this.http.put<any>(url, contactData, this.getHeadersWithToken());
    }
    
    // #####################################################################################################
    // ----- DELETE's -----------------------------------------------------------------------------------------
    // #####################################################################################################
    
    deleteTaskApi(taskID:number) {
        const url = environment.baseURL + "/tasks/" + taskID + "/";
        return this.http.delete<any>(url, this.getHeadersWithToken());
    }
    
    deleteContactApi(contactID:number) {
        const url = environment.baseURL + "/contacts/" + contactID + "/";
        return this.http.delete<any>(url, this.getHeadersWithToken());
    }
    
    // #####################################################################################################
    // ----- LOGIN -----------------------------------------------------------------------------------------
    // #####################################################################################################
    
    public loginOnApi(username: string, password: string): Promise<any> {
        const url = environment.baseURL + "/login/";
        const body ={
            "username": username,
            "password": password
        };
        const headers = {headers:{'Content-Type':'application/json; charset=utf-8'}};
        
        return lastValueFrom(this.http.post<any>(url,body,headers));
    }






    // #####################################################################################################
    // ----- Functions -------------------------------------------------------------------------------------
    // #####################################################################################################
    // ----- READ's -----------------------------------------------------------------------------------------
    // #####################################################################################################

    // public getTasksInRow(row:any):any {
    //     return this.tasks.filter((task: { status: any; }) => task.status == row);
    // }

    async getAllTasks(): Promise<any> {
        try {
            const data = await lastValueFrom(this.getTasksFromApi());
            // console.log('Empfangene Daten:', data);
            this.tasks = data;
            return this.tasks;
        } catch (error) {
            console.error('Fehler beim Abrufen der Daten:', error);
            throw error;
        }
    }

    async getAllContacts(): Promise<any> {
        try {
            const data = await lastValueFrom(this.getContactsFromApi());
            // console.log('Empfangene Daten:', data);
            this.tasks = data;
            return this.tasks;
        } catch (error) {
            console.error('Fehler beim Abrufen der Daten:', error);
            throw error;
        }
    }


    // #######################################################################################################
    // ----- SAVE's -----
    // #######################################################################################################

    saveTask(taskItem:Task):any {
        this.putTaskToApi(taskItem, taskItem.id).subscribe((status)=>{
            // console.log('saveTask - PUTsub', status);
            return status;
        });
    }


    saveContact(contactItem:Contact):any {
        this.putContactToApi(contactItem, contactItem.id).subscribe((status)=>{
            // console.log('saveContact - PUTsub', status);
            return status;
        });
    }


    // #######################################################################################################
    // ----- CREATE's -----
    // #######################################################################################################

    createContact(contactItem:Contact) {
        this.postContactToApi(contactItem).subscribe((status)=>{
            console.log('backend - createContact', status);
            return status;
        });
    }

    // #######################################################################################################
    // ----- DELETE's -----
    // #######################################################################################################

    deleteTask(taskItem:Task) {
        return this.deleteTaskApi(taskItem.id);
    }

    deleteContact(contactItem:Contact) {
        return this.deleteContactApi(contactItem.id);
    }



}
