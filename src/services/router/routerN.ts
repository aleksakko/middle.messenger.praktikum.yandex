class Router {
    constructor() {

    }
    use (path: string, block: Block) {}
    start() {} // запустить роутер
    go(path: string) {}
    back() {} // переход назад по истории браузера
    forward() {} // переход вперёд по истории браузера
}

// перемещение вперед и назад по истории
window.history.back(); // работает как кнопка Назад // popstate!
window.history.forward(); // работает как кнопка вперед

window.history.go(-2) // перемещение на несолько записей

const length = window.history.length; // количество записей

// изменение истории
const state = { foo: 'bar' };
window.history.pushState( // popstate нет!
    state, // объект состояния
    'Page Title', // заголовок состояния
    '/pages/login' // URL новой записи (относительно)
);
window.history.replaceState(state2, 'Other Title', '/another/page'); // popstate нет!



const router = new Router();

router
    // конфигурируем роутер, указывая, на каких UTLкакую страницу отображать
    .use('/', MainBlock)
    .use('/chats/{chatId}', ChatsBlock)
    // запускаем роутер
    .start()
