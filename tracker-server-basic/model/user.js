"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id = "", username = "", email = "", firstName = "", lastName = "", sex = "", address = "", postalCode = "", city = "", country = "") {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.sex = sex;
        this.address = address;
        this.postalCode = postalCode;
        this.city = city;
        this.country = country;
    }
}
exports.User = User;
