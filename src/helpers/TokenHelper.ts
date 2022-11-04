import userAPI from "../API/UserAPI";

class TokenHelper {

    answer: boolean;

    constructor() {
        this.answer = false;
    }

    public isAdmin(): boolean {
        userAPI.getCredentials(this.success, this.fail);
        return this.answer;
    }

    success = (response: any) => {
        this.answer = response.data.roles && response.data.roles.some((element: any) => JSON.stringify(element) === JSON.stringify({
            roleId: 2,
            roleName: "ADMIN"
        }));
    }

    fail = (error: any) => {
        this.answer = false;
    }
}

let tokenHelper = new TokenHelper();
export default tokenHelper;