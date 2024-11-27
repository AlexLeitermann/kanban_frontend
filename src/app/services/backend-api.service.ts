import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject, lastValueFrom, Observable, of } from 'rxjs';
import { Contact } from '../models/contact.class';
import { Task } from '../models/task.class';
import { User } from '../models/user.class';

@Injectable({
    providedIn: 'root'
})
export class BackendApiService {
    private tasksSubject = new BehaviorSubject<any[]>([]);
    private contactSubject = new BehaviorSubject<any[]>([]);
    public tasks$ = this.tasksSubject.asObservable();
    public contacts$ = this.contactSubject.asObservable();
    public currentUser = new User;
    tasks: Task[] = [];
    contacts: Contact[] = [];
    users: User[] = [];
    public token = localStorage.getItem('link-token') || undefined;
    
    constructor(private http: HttpClient) {
        if (this.token) {
            this.initData();
            this.fetchCurrentUser();
        }
    }

    public initData(): void {
        this.initTasks();
        this.initContacts();
        this.initUsers();
    }

    initTasks() {
        this.getTasksFromApi().subscribe((items) => { 
            this.tasks = items; 
            this.tasksSubject.next(this.tasks);
        });
    }

    initContacts() {
        this.getContactsFromApi().subscribe((items) => { 
            this.contacts = items; 
            this.contactSubject.next(this.contacts);
        });
    }

    initUsers() {
        this.getUsersFromApi().subscribe((items) => { 
            this.users = items; 
        });
    }

    getHeaders(): any {
        return {
            headers: {
                'Content-Type':'application/json',
                'Accept':'application/json',
                ...(this.token && {'Authorization': `Token ${this.token}`})
            }
        };
    }

    async fetchCurrentUser(): Promise<void> {
        if (!this.token) {
            return;
        }

        try {
            const userData = await this.getUserFromToken(this.token);
            this.currentUser = {
                'id': userData.id,
                'email': userData.email,
                'username': userData.username,
                'first_name': userData.first_name,
                'last_name': userData.last_name
            };
        } catch (error) {
            console.error('Fehler beim Laden des currentUser:', error);
        }
    }
    
    // #####################################################################################################
    // ----- API's -----------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------
    // ----- GET's -----------------------------------------------------------------------------------------
    // #####################################################################################################
    
    getTasksFromApi(): Observable<any> {
        const url = environment.baseURL + "/tasks/";
        return this.http.get<any>(url, this.getHeaders());
    }
    
    getContactsFromApi(): Observable<any> {
        const url = environment.baseURL + "/contacts/";
        return this.http.get<any>(url, this.getHeaders());
    }
    
    getUsersFromApi(): Observable<any> {
        const url = environment.baseURL + "/users/";
        return this.http.get<any>(url, this.getHeaders());
    }
    
    // #####################################################################################################
    // ----- POST's -----------------------------------------------------------------------------------------
    // #####################################################################################################
    
    postTaskToApi(taskData:any) {
        if (taskData.members == "") {
            taskData.members = JSON.stringify([]);
        }
        const url = environment.baseURL + "/tasks/";
        return this.http.post<any>(url, taskData, this.getHeaders());
    }
    
    postContactToApi(contactData:any) {
        const url = environment.baseURL + "/contacts/";
        return this.http.post<any>(url, contactData, this.getHeaders());
    }
    
    postUserToApi(userData:any) {
        const url = environment.baseURL + "/users/";
        return this.http.post<any>(url, userData, this.getHeaders());
    }
    
    // #####################################################################################################
    // ----- PUT's -----------------------------------------------------------------------------------------
    // #####################################################################################################
    
    putTaskToApi(taskData:any, taskID:number) {
        if (taskData.members == "") {
            taskData.members = JSON.stringify([]);
        }
        const url = environment.baseURL + "/tasks/" + taskID + "/";
        return this.http.put<any>(url, taskData, this.getHeaders());
    }
    
    putContactToApi(contactData:any, contactID:number): Observable<any> {
        const url = environment.baseURL + "/contacts/" + contactID + "/";
        return this.http.put<any>(url, contactData, this.getHeaders());
    }
    
    // #####################################################################################################
    // ----- DELETE's -----------------------------------------------------------------------------------------
    // #####################################################################################################
    
    deleteTaskApi(taskID:number) {
        const url = environment.baseURL + "/tasks/" + taskID + "/";
        return this.http.delete<any>(url, this.getHeaders());
    }
    
    deleteContactApi(contactID:number) {
        const url = environment.baseURL + "/contacts/" + contactID + "/";
        return this.http.delete<any>(url, this.getHeaders());
    }
    
    // #####################################################################################################
    // ----- LOGIN -----------------------------------------------------------------------------------------
    // #####################################################################################################
    
    async loginOnApi(username: string, password: string): Promise<any> {
        const url = environment.baseURL + "/login/";
        const body ={
            "username": username,
            "password": password
        };
        const res:any = await lastValueFrom(this.http.post<any>(url,body,this.getHeaders()));
        this.token = res.token;
        localStorage.setItem('link-token', res.token);
        await this.fetchCurrentUser();
        this.initData();
        return res;
    }
    
    public registerOnApi(newUser: User) {
        const url = environment.baseURL + "/register/";
        return this.http.post<any>(url, newUser, this.getHeaders());
    }
    
    public getUserFromToken(token: string): Promise<any> {
        const url = environment.baseURL + "/currentuser/";
        const body ={
            "token": token
        };
        return lastValueFrom(this.http.post<any>(url,body,this.getHeaders()));
    }




    // #####################################################################################################
    // ----- Functions -------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------
    // ----- READ's -----------------------------------------------------------------------------------------
    // #####################################################################################################

    async getAllTasks(): Promise<any> {
        try {
            const data = await lastValueFrom(this.getTasksFromApi());
            this.tasks = data;
            return this.tasks;
        } catch (error) {
            console.error('Fehler beim Abrufen der Daten (tasks):', error);
            throw error;
        }
    }

    async getAllContacts(): Promise<any> {
        try {
            const data = await lastValueFrom(this.getContactsFromApi());
            this.contacts = data;
            return this.contacts;
        } catch (error) {
            console.error('Fehler beim Abrufen der Daten (contacts):', error);
            throw error;
        }
    }

    async getCurrentUserFromID(getID:any) {
        const userIndex = this.users.indexOf(getID);
        if (userIndex !== -1) {
            await this.setCurrentUser(userIndex);
        }
    }

    async getContactFromID(getID:any):Promise<any> {
        this.getAllContacts();
        const contactIndex = this.contacts.findIndex(c => {
            return c.id == getID;
        });
        if (contactIndex !== -1) {
            return this.contacts[contactIndex];
        }
        return false;
    }
    
    async setCurrentUser(userIndex: number) {
        this.currentUser.id = this.users[userIndex].id;
        this.currentUser.email = this.users[userIndex].email;
        this.currentUser.first_name = this.users[userIndex].first_name;
        this.currentUser.last_name = this.users[userIndex].last_name;
        this.currentUser.username = this.users[userIndex].username;
    }


    // #######################################################################################################
    // ----- SAVE's -----
    // #######################################################################################################

    saveTask(taskItem:Task) {
        return this.putTaskToApi(taskItem, taskItem.id);
    }

    saveContact(contactItem:Contact):Observable<any> {
        return this.putContactToApi(contactItem, contactItem.id);
    }

    // #######################################################################################################
    // ----- CREATE's -----
    // #######################################################################################################

    createContact(contactItem:Contact) {
        this.postContactToApi(contactItem).subscribe((status)=>{
            return status;
        });
    }

    createTask(taskItem:Task) {
        return this.postTaskToApi(taskItem);
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

    // #######################################################################################################
    // ----- Weitere Funktionen -----
    // #######################################################################################################

    public async removeMemberFromAllTasks(memberID: number): Promise<void> {
        const updateTasksPromises = this.tasks.map(async (task) => {
            const members = JSON.parse(task.members || '[]');
            const updatedMembers = members.filter((id: number) => id !== memberID);
            if (members.length !== updatedMembers.length) {
                task.members = JSON.stringify(updatedMembers);
                await lastValueFrom(this.saveTask(task));
            }
        });
        await Promise.all(updateTasksPromises);
        this.initTasks();
    }

}
