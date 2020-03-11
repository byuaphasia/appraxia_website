export default class UserAttributes {
    email : string;
    name : string;
    phoneNumber: string;
    address: string;

    constructor(email: string = "", name: string = "", phoneNumber: string = "", address: string = "") {
        this.email = email;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }
}
