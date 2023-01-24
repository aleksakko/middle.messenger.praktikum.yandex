import constants from "../modules/constants.js";
const routes = constants.routes;

import mytpl from "../pages/404.mytpl";
console.log(mytpl);

import MainPage from "../pages/main.hbs";
import _404Page from "../pages/404.hbs";
import _500Page from "../pages/500.hbs";
import AuthPage from "../pages/auth.hbs";
import RegPage from "../pages/reg.hbs";
import ChatsPage from "../pages/chats-list.hbs";
import ProfilePage from "../pages/profile.hbs";
import ChangeProfPage from "../pages/change-profile.hbs";
import ChangePassPage from "../pages/change-pass.hbs";

const render = (pth) => {
    let result, title = 'messenger';
    
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

    document.getElementById('app').innerHTML = result;
    document.getElementsByTagName('title')[0].textContent = 'SPA ' + title;
    document.getElementById('header-title').textContent = title;
}

const addDom = (pth) => {
    window.history.pushState({pth}, '', pth);
    render(pth);
}

const goRouter = () => {
    render(window.location.pathname);

    window.addEventListener('popstate', () => {        
        render(window.location.pathname);
    })

    document.body.addEventListener('click', e => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                e.stopImmediatePropagation(); // !!!
                addDom(e.target.pathname);
            }
        }, true
    )
}

export default goRouter;
