import UsersAPI from "../api/UsersAPI";
import router, { Routes } from "../router";
import store from "../Store";

class UsersController {
    private api = new UsersAPI();
    
    async request(req: () => void) {
        store.set('user.isLoading', true); // можно крутить loader пока идет загрузка

        try {
            console.log('-----------request try')
            
            await req();
            
            store.set('user.error', undefined);
        } catch (e: any) {
            console.log('request catch')

            store.set('user.error', e);
        } finally {
            console.log('request finally')
            store.set('user.isLoading', false);
        }
    }

    async setProf(profileData: apiSignupData) {
            console.log('--------------setProf start')
        await this.request(async () => {
            const user: apiUser = await this.api.setProf(profileData);

            store.set('user.data', user);
            
            router.go(Routes.Profile);            
        })
    }
    
    async setAvatar(avatar: FormData) {
            console.log('------------signin start')
        await this.request(async () => {
            const user: apiUser = await this.api.setAvatar(avatar);
            
            store.set('user.data', user);

            router.go(Routes.Profile);
        })
    }
    
    async setPass(passData: apiPass) {
            console.log('------------setPass start')
        await this.request(async () => {
            await this.api.setPass(passData);

            alert('пароль успешно изменен')
            
            router.go(Routes.Profile);
        })
    }

    async getUserId(id: number) {
        try {
            console.log('------------getUserId try');
            const user: apiUser = await this.api.getUserId(id);

            // подумать либо в контролере возвращать, либо записывать результат в стор
            //store.set('user.data', user);
        } catch (e) {
            console.log('getUserId catch');
            //store.set('user.error', e);
        }
    }

    async searchUsers(login: string) {
        try {
            console.log('------------searchUsers try');
            const users: apiUser[] = await this.api.searchUsers(login);

            // подумать либо в контролере возвращать, либо записывать результат в стор
            //store.set('user.data', user);
        } catch (e) {
            console.log('searchUsers catch');
            //store.set('user.error', e);
        }
    }
}

export default new UsersController();
