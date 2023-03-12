import './index.scss';

// создано несколько хелперов для handlebars
import './utils/handlebarsHelpers.ts';

import AuthController from './services/controllers/AuthController';
import router, { Routes } from './services/router';
import MainPage from './pages/Main';
import AuthPage from './pages/Auth';
import RegPage from './pages/Reg';
import ChatsPage from './pages/Chats';
import ProfilePage from './pages/Profile';
import ChangeProfilePage from './pages/ChangeProfile';
import ChangePassPage from './pages/ChangePass';
import ErrorProps from './services/router/errorProps';
import ErrorPage from "./components/Error"

router
    .use(Routes.Main, MainPage, { title: 'Test' })
    .use(Routes.Auth, AuthPage, { title: 'Авторизация' })
    .use(Routes.Reg, RegPage, { title: 'Регистрация' })
    .use(Routes.Messenger, ChatsPage, { title: 'Чаты' })
    .use(Routes.Profile, ProfilePage, { title: 'Личность' })
    .use(Routes.ChangeProfile, ChangeProfilePage, { title: 'Изменение личности' })
    .use(Routes.ChangePassword, ChangePassPage, { title: 'Изменение пароля' })
    .use(Routes.Error500, ErrorPage, { 
        title: '500',
        props: ErrorProps['500']
    })
    .use(Routes.Error404, ErrorPage, { 
        title: '404',
        props: ErrorProps['404']
    })

window.addEventListener('DOMContentLoaded', async () => {
    
    let isProtectedRoute = true;

    switch (window.location.pathname) {
        case Routes.Auth:
        case Routes.Reg: isProtectedRoute = false; break;
    }

    try {
        await AuthController.getUser();

        if (!isProtectedRoute) {
            router.go(Routes.Profile)
        }
    } catch (err) {
        isProtectedRoute && router.go(Routes.Auth)
    } finally {   
        router.start();     
    }
})
