export class Contact {
    id: number;
    name: string;
    initials: string;
    email: string;
    phone: string;

    constructor (obj?: any) {
        if (obj) {
            this.id = obj.id ? obj.id : 0;
            this.name = obj.name ? obj.name : '';
            this.initials = obj.initials ? obj.initials : '';
            this.email = obj.email ? obj.email : '';
            this.phone = obj.phone ? obj.phone : '';
        } else {
            this.id = 0;
            this.name = '';
            this.initials = '';
            this.email = '';
            this.phone = '';
        }
    }

}
