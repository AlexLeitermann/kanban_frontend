import { Contact } from "./contact.class";

export class Member {
    id: number;
    member: Contact;

    constructor (obj?: any) {
        this.id = obj ? obj.id : 0;
        this.member = obj ? obj.member : new Contact;
    }

}
