export class Contact {
    id!: number;
    name!: string;
    initials!: string;
    email!: string;
    phone!: string;

    constructor (obj?: any) {
        this.id = obj ? obj.id : 0;
        this.name = obj ? obj.name : '';
        this.initials = obj ? obj.initials : '';
        this.email = obj ? obj.email : '';
        this.phone = obj ? obj.phone : '';
    }

}
