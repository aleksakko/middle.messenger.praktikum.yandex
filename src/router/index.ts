import routes from "./routes";

//import mytpl from "../pages/temp/404.mytpl";
//console.log(mytpl);

import ErrorProps from './errorProps';
import ErrorPage from '../components/Error';
import MainPage from '../pages/Main';
import AuthPage from "../pages/Auth";
import RegPage from "../pages/Reg";
// import ChatsPage from "../pages/chats-list";
import ChatsPageTest from "../pages/Chats";
import ProfilePage from "../pages/Profile";
import ChangeProfPage from "../pages/ChangeProfile";
import ChangePassPage from "../pages/ChangePass";
const components: Record<string, any> = {
    MainPage, AuthPage, RegPage, ProfilePage, ChangeProfPage, ChangePassPage, ErrorPage, ChatsPageTest
}; // объект с конструкторами-компонентов
//const components = {MainPage, _404Page, _500Page, AuthPage, RegPage, 
    // ChatsPage, ProfilePage, ChangeProfPage, ChangePassPage}

// import MmainPage from "../pages/temp/main.hbs";
// import AuthPage from "../pages/temp/auth.hbs";
// import RegPage from "../pages/temp/reg.hbs";
import ChatsPage from "../pages/temp/chats-list.hbs";
// import ProfilePage from "../pages/temp/profile.hbs";
// import ChangeProfPage from "../pages/temp/change-profile.hbs";
// import ChangePassPage from "../pages/temp/change-pass.hbs";

// (пока в форме модуля) объект-кэш с экземплярами страниц активной сессии
export const sessionPages: Record<string, any> = {}; 

const render = (pth: string) => {
    let result: string | any, // any убрать
        namepage: string = '',
        title: string,
        props: any,
        keyError: Record<string, string | number> = {};
    
    try {
        if (routes.main.match(pth)) {
            namepage = 'MainPage';
            title = 'messenger';
        } else if (routes.auth.match(pth)) {
            namepage = 'AuthPage';
            title = 'Авторизация';
        } else if (routes.reg.match(pth)) {
            namepage = 'RegPage';
            title = 'Регистрация';            
        } else if (routes.chats.match(pth)) {
            result = ChatsPage({});
            title = 'Чаты';
        } else if ('/chats-test'.match(pth)) {
            namepage = 'ChatsPageTest';
            title = 'Чаты-тест';
        } else if (routes.profile.match(pth)) {
            namepage = 'ProfilePage';
            title = 'Личность';
        } else if (routes.changeProf.match(pth)) {
            namepage = 'ChangeProfPage';
            title = 'Изменение личности';
        } else if (routes.changePass.match(pth)) {
            namepage = 'ChangePassPage';
            title = 'Изменение пароля';
        } else if (routes._404.match(pth)) {
            namepage = 'ErrorPage404';
            keyError = ErrorProps['404'];
            title = '404';
        } else if (routes._500.match(pth)) {
            namepage = 'ErrorPage500';
            keyError = ErrorProps['500'];
            title = '500';
        } else {
            namepage = 'ErrorPage404';
            keyError = ErrorProps['404'];
            title = '404';
        }
    } catch (error) {
        namepage = 'ErrorPage500';
        keyError = ErrorProps['500'];
        title = '500';
        console.log(error);
    }
    //console.log(typeof result);
    const app = (<HTMLElement>document.getElementById('app'));
    if (namepage) {
        if (!sessionPages[namepage]) {
            if (keyError.href) {
                //console.log(namepage, keyError.href)
                sessionPages[namepage] = new components['ErrorPage'](keyError);
            } else {
                //console.log(namepage);
                sessionPages[namepage] = new components[namepage](props);
            }
        }
        // console.log(sessionPages);
        result = sessionPages[namepage];
        app.innerHTML = ''; 
        app.append(result.getContent());
    } else app.innerHTML = result;
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
                //e.stopImmediatePropagation(); // !!!
                addDom(target.pathname);
                //console.log(e.target);
            }
        }, true
    )
}

export default goRouter;
