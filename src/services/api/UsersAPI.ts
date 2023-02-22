import BaseAPI from "./BaseAPI";

export default class UsersAPI extends BaseAPI {
    constructor() {
        super('/user');
    }
    
    public setProf(profData: apiSignupData): Promise<apiUser> {
        return this.http.put('/profile', profData);
    }
    
    public setAvatar(avaData: FormData): Promise<apiUser> {
        return this.http.put('/profile/avatar', avaData, 'multipart/form-data');        
    }

    // get User
    public setPass(passData: apiPass) {
        return this.http.put('/password', passData);
    }

    public getUserId(id: number): Promise<apiUser> {
        return this.http.get(`/${id}`);
    }
    
    public searchUsers(login: string): Promise<apiUser[]> {
        return this.http.post('/logout', {login: login});
    }

    create = undefined;
    read = undefined;
    update = undefined;
    delete = undefined;
}
