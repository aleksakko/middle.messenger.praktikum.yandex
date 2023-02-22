import AuthAPI from "../api/AuthAPI";
import router, { Routes } from "../router";
import store from "../Store";

class AuthController {
    private api = new AuthAPI();
    
    async request(req: () => void) {
        store.set('user.isLoading', true); // можно крутить loader пока идет загрузка

        try {
            console.log('-----------request try')
            await req();
            
            store.set('user.error', undefined);
        } catch (e: any) {
            console.log('request catch')
            alert(e.reason);
            store.set('user.error', e);
        } finally {
            console.log('request finally')
            store.set('user.isLoading', false);
        }
    }

    async signup(signupData: apiSignupData) {
            console.log('--------------signup start')
        await this.request(async () => {
            await this.api.signup(signupData);
            
            await this.getUser();
            
            router.go(Routes.Messenger);            
        })
    }
    
    async signin(signinData: apiSigninData) {
            console.log('------------signin start')
        await this.request(async () => {
            await this.api.signin(signinData);
            await this.getUser();

            router.go(Routes.Profile);
        })
    }
    
    async logout() {
        await this.request(async () => {
            await this.api.logout();
            // не забыть очистить все формы.выгрузить удалить все из памяти
            
            router.go(Routes.Auth); // пусть сразу выход..
        })
    }

    async getUser() {
        try {
            console.log('------------getUser try');
            const user: apiUser = await this.api.read();

            store.set('user.data', user);
        } catch (e: any) {
            console.log('getUser catch');
            alert(e.reason)
            store.set('user.error', e);
        }
    }
}

export default new AuthController();
