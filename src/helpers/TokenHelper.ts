import userAPI from "../API/UserAPI";

class TokenHelper {

    answerUser: boolean;
    answerAdmin: boolean;

    constructor() {
        this.answerAdmin = false;
        this.answerUser = false;
    }

    public isAdmin(): boolean {
        userAPI.getCredentials(this.successAdmin, this.failAdmin);
        return this.answerAdmin;
    }

    private success(response: any, roleId: number, roleName: string): boolean {
        return response.data.roles
            && response.data.roles.some((element: any) => JSON.stringify(element) === JSON.stringify({
                roleId: roleId,
                roleName: roleName
            }));
    }

    successAdmin = (response: any) => {
        this.answerAdmin = this.success(response, 2, "ADMIN");
    }

    failAdmin = (error: any) => {
        this.answerAdmin = false;
    }

    public isUser(): boolean {
        userAPI.getCredentials(this.successUser, this.failUser);
        return this.answerUser;
    }

    successUser = (response: any) => {
        this.answerUser = this.success(response, 1, "USER");
    }

    failUser = (error: any) => {
        this.answerUser = false;
    }
}

let tokenHelper = new TokenHelper();
export default tokenHelper;