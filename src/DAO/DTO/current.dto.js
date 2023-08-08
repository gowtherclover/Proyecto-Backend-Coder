export default class CurrentDTO {
    constructor(dataUser) {
        this.first_name = dataUser.first_name == 'noname'? '' : dataUser.first_name;
        this.last_name = dataUser.last_name == 'nolast'? '' : dataUser.last_name;
        this.username = dataUser.username;
        this.email = dataUser.email;
        this.age = dataUser.age == 'noage'? '---' : dataUser.age;
        this.role = dataUser.role;
    }
}