import BaseAPI from "./BaseAPI";

export default class UsersAPI extends BaseAPI {
    constructor() {
        super('/user');
    }
    
    // change profile settings
    public setProf(profData: apiSignupData): Promise<apiUser> {
        return this.http.put('/profile', profData);
    }

    // change avatar
    public setAvatar(avaData: FormData): Promise<apiUser> {
        return this.http.put('/profile/avatar', avaData, 'multipart/form-data');        
    }

    // change password
    public setPass(passData: apiPass) {
        return this.http.put('/password', passData);
    }
    
    public getUserId(id: number): Promise<apiUser> {
        return this.http.get(`/${id}`);
    }
    
    public searchUsers(login: string): Promise<apiUser[]> {
        return this.http.post('/search', {login: login});
    }

    create = undefined;
    read = undefined;
    update = undefined;
    delete = undefined;
}
