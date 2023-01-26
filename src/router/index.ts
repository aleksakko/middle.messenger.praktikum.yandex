import { routes } from "../modules/constants";

import mytpl from "../pages/404.mytpl";
console.log(mytpl);

import MainPage from "../pages/temp/main.hbs";
import _404Page from "../pages/temp/404.hbs";
import _500Page from "../pages/temp/500.hbs";
import AuthPage from "../pages/temp/auth.hbs";
import RegPage from "../pages/temp/reg.hbs";
import ChatsPage from "../pages/temp/chats-list.hbs";
import ProfilePage from "../pages/temp/profile.hbs";
import ChangeProfPage from "../pages/temp/change-profile.hbs";
import ChangePassPage from "../pages/temp/change-pass.hbs";

const render = (pth: string) => {
    let result: string, 
        title: string = 'messenger';
    
    try {
        if (routes.main.match(pth)) {
            result = MainPage();
        } else if (routes.auth.match(pth)) {
            result = AuthPage();
            title = 'Авторизация';
        } else if (routes.reg.match(pth)) {
            result = RegPage();
            title = 'Регистрация';
        } else if (routes.chats.match(pth)) {
            result = ChatsPage();
            title = 'Чаты';
        } else if (routes.profile.match(pth)) {
            result = ProfilePage();
            title = 'Личность';
        } else if (routes.changeProf.match(pth)) {
            result = ChangeProfPage();
            title = 'Изменение личности';
        } else if (routes.changePass.match(pth)) {
            result = ChangePassPage();
            title = 'Изменение пароля';
        } else if (routes._404.match(pth)) {
            result = _404Page();
            title = '404';
        } else if (routes._500.match(pth)) {
            result = _500Page();
            title = '500';
        } else {
            result = _404Page();
            title = '404';
        }
    } catch (error) {
        result = _500Page();
        title = '500';
        console.log(error);
    }

    console.log(typeof result);
    (<HTMLElement>document.getElementById('app')).innerHTML = result;
    (<HTMLTitleElement>document.getElementsByTagName('title')[0]).textContent = 'SPA ' + title;
    (<HTMLElement>document.getElementById('header-title')).textContent = title;
}

const addDom = (pth: string) => {
    window.history.pushState({pth}, '', pth);
    render(pth);
}

const goRouter = () => {
    render(window.location.pathname);

    window.addEventListener('popstate', () => {        
        render(window.location.pathname);
    })

    document.body.addEventListener('click', (e) => {
            const target = e.target as HTMLAnchorElement;
            if (target.tagName === 'A') {
                e.preventDefault();
                e.stopImmediatePropagation(); // !!!
                addDom(target.pathname);
                console.log(e.target);
            }
        }, true
    )
}

export default goRouter;
