import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { BoardComponent } from './components/board/board.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { AddtaskComponent } from './components/addtask/addtask.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';

export const routes: Routes = [
    {path:'', redirectTo: 'login', pathMatch: 'full'},
    {path:'login', component: LoginComponent},
    {path:'register', component: RegisterComponent},
    {path:'home', component: HomeComponent,
    children: [
        {path:'board', component: BoardComponent},
        {path:'addtask', component: AddtaskComponent},
        {path:'contacts', component: ContactsComponent},
    ]
    },
    {path:'**', component: PagenotfoundComponent},
];
