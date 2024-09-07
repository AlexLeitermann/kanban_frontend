import { User } from "./user.class";

export class Task {
    id: number;
    title?: string;
    description?: string;
    color: number;
    status: number;
    priority: number;
    created_at?: Date;
    author: User;

    constructor (obj?: any) {
        this.id = obj ? obj.id : 0;
        this.title = obj ? obj.title : '';
        this.description = obj ? obj.description : '';
        this.color = obj ? obj.color : 0;
        this.status = obj ? obj.status : 0;
        this.created_at = obj ? obj.created_at : '';
        this.author = obj ? obj.author : new User;
        this.priority = obj ? obj.priority : 0;
    }


}



