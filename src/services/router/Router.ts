import MainPage from "../../pages/Main";
import AuthPage from "../../pages/Auth";
import RegPage from "../../pages/Reg";
import ChatsPage from "../../pages/Chats";
import ProfilePage from "../../pages/Profile";
import ChangeProfilePage from "../../pages/ChangeProfile";
import ChangePassPage from "../../pages/ChangePass";

import ErrorProps from "./errorProps";
import ErrorPage from "../../components/Error"

import Block from "../../utils/Block";
import Route from "./Route";



class Router {
    static __INSTANCE: Router;
    
    public routes!: Route[];
    public history!: Record<string, any>;
    protected _currentRoute!: Route | null;
    protected _rootQuery!: string;
    
    // START CONSTRUCTOR ----------------------------------------------
    constructor( rootQuery: string ) {
        
        // Синглтон - если инстанс есть, то новый инстанс Router не создаем
        if (Router.__INSTANCE) {
            return Router.__INSTANCE;
        }
        Router.__INSTANCE = this;
        
        this.routes = []; // массив инстансов - Блоки страниц, путей 
        this.history = window.history;
        this._currentRoute = null;
        this._rootQuery = rootQuery;

        // подписка на клики, возможно не понадобится
        document.body.addEventListener('click', (e) => {
            const target = e.target as HTMLAnchorElement;
            if (target.tagName === 'A') {
                e.preventDefault();
                this.go(target.pathname);
                console.log(e.target);
            }
        }, true)
    }
    // END CONSTRUCTOR ----------------------------------------------

    // инициализация рутов. 2 обязательных параметра, props и rootQuery не обязательно
    use(
        path: string, // !
        blockClass: new (Props?: any) => Block, // ! 
        props: Record<string, any> = {}, // ? или указанные пропсы
        rootQuery = this._rootQuery // ? или указанный query нужного элемента
    ){
        const route = new Route(path, blockClass, props, rootQuery);

        this.routes.push(route);
        
        return this; // возможность чейнинга
    }

    // подписка на изменение истории и инициализация текущего пути (первый запуск '/')
    start() {
        window.onpopstate = (() => {
            this._onRoute(window.location.pathname);
        }).bind(this);

        this._onRoute(window.location.pathname);
    }

    // изменение истории и переход на /path
    go(path: string) {
        this.history.pushState({}, "", path);
        this._onRoute(path);
    }

    // логика перехода на /path
    _onRoute(path: string) {
        console.log(path);
        let route = this.getRoute(path);
        
        if (!route) {
            route = this.getRoute('/error-404');
            if (!route) return;
        }

        if (this._currentRoute) {
            console.log('this._currentRoute: ' + this._currentRoute)
            this._currentRoute.leave();
        }

        this._currentRoute = route;
        route.render();
    }

    getRoute(path: string) {
        return this.routes.find(route => route.match(path));
    }

    back() { this.history.back(); }

    forward() { this.history.forward(); }
}



const router = new Router('#app');

router
    .use('/', MainPage)
    .use('/authorization', AuthPage)
    .use('/registration', RegPage)
    .use('/list-of-chats', ChatsPage)
    .use('/profile', ProfilePage)
    .use('/change-profile', ChangeProfilePage)
    .use('/change-password', ChangePassPage)
    .use('/error-500', ErrorPage, ErrorProps['500'])
    .use('/error-404', ErrorPage, ErrorProps['404'])

    export default router; // экспортируем инстанс Роутера как синглтон
