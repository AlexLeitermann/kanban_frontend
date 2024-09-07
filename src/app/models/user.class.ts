export class User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;

    constructor (obj?: any) {
        this.id = obj ? obj.id : 0;
        this.first_name = obj ? obj.first_name : '';
        this.last_name = obj ? obj.last_name : '';
        this.username = obj ? obj.username : '';
        this.email = obj ? obj.email : '';
    }




}
