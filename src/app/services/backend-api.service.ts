import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject, lastValueFrom, Observable, of } from 'rxjs';
import { Contact } from '../models/contact.class';
import { Task } from '../models/task.class';
import { User } from '../models/user.class';

@Injectable({
    providedIn: 'root'
})
export class BackendApiService implements OnInit {
    private tasksSubject = new BehaviorSubject<any[]>([]);
    private contactSubject = new BehaviorSubject<any[]>([]);
    tasks: Task[] = [];
    contacts: Contact[] = [];
    users: User[] = [];
    // tasksObservable$:any;
    // contactsObservable$:any;
    public currentUser = new User;

    apiHeaders = {headers:{
        'Content-Type':'application/json',
        'Accept':'application/json',
    }};

    public tasks$ = this.tasksSubject.asObservable();
    public contacts$ = this.contactSubject.asObservable();
    public token: string | undefined = undefined;

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.getTasksFromApi().subscribe((items) => { this.tasks = items; });
        this.getContactsFromApi().subscribe((items) => { this.contacts = items; console.log('backend.serv - contacts - OK'); });
        this.getUsersFromApi().subscribe((items) => { this.users = items; });
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
    // -----------------------------------------------------------------------------------------------------
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
        if (taskData.members == "") {
            taskData.members = JSON.stringify([]);
        }
        console.log('send Data:', taskData);
        
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
        if (taskData.members == "") {
            taskData.members = JSON.stringify([]);
        }
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
    
    
    public getUserFromToken(token: string): Promise<any> {
        const url = environment.baseURL + "/currentuser/";
        const body ={
            "token": token
        };
        return lastValueFrom(this.http.post<any>(url,body,this.getHeadersWithToken()));
    }




    // #####################################################################################################
    // ----- Functions -------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------
    // ----- READ's -----------------------------------------------------------------------------------------
    // #####################################################################################################

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

    getCurrentUserFromID(getID:any) {
        const userIndex = this.users.indexOf(getID);
        if (userIndex !== -1) {
            this.setCurrentUser(userIndex);
        }
    }

    setCurrentUser(userIndex: number) {
        this.currentUser.id = this.users[userIndex].id;
        this.currentUser.email = this.users[userIndex].email;
        this.currentUser.first_name = this.users[userIndex].first_name;
        this.currentUser.last_name = this.users[userIndex].last_name;
        this.currentUser.username = this.users[userIndex].username;
    }

    async getContactFromID(getID:any):Promise<any> {
        console.log('getContactFromID contacts? :', this.contacts.length);
        if (this.contacts.length == 0) {
            this.getContactsFromApi().subscribe((items) => { this.contacts = items; });
        }
        // const contactIndex = this.contacts.indexOf(getID);
        const contactIndex = this.contacts.findIndex(c => {
            return c.id == getID;
        });
        console.log('getContactFromID :', this.contacts);
        console.log('getContactFromID ' + getID + ':', contactIndex);
        if (contactIndex !== -1) {
            return this.contacts[contactIndex];
        }
        return false;
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
            // console.log('backend - createContact', status);
            return status;
        });
    }

    async createTask(taskItem:Task) {
        this.postTaskToApi(taskItem).subscribe((status)=>{
            console.log('backend - createTask', status);
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
