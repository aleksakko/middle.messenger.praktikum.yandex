import BaseAPI from "./BaseAPI";

export default class AuthAPI extends BaseAPI {
    constructor() {
        super('/auth');
    }
    
    public signin(signinData: apiSigninData) {
        return this.http.post('/signin', signinData);
    }
    
    public signup(signupData: apiSignupData) {
        return this.http.post('/signup', signupData);        
    }

    // get User
    public read(): Promise<apiUser> {
        return this.http.get('/user');
    }

    public logout() {
        return this.http.post('/logout');
    }

    create = undefined;
    update = undefined;
    delete = undefined;
}
