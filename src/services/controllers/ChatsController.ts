// import AuthAPI from "../api/AuthAPI";
// import store from "../Store";

// export default class AuthController {
//     private api = new AuthAPI();
    
//     async signup(signupData: apiSignupData) {
//         try {
//             await this.api.signup(signupData);
    
//             await this.getUser();            
//         } catch (e) {
//             alert('Ошибка при регистрации');
//         }
//     }
    
//     async signin(signinData: apiSigninData) {
//         try {
//             await this.api.signin(signinData);
    
//             await this.getUser();            
//         } catch (e) {
//             alert('Ошибка при авторизации');
//         }
//     }

//     async logout() {
//         try {
//             await this.api.logout();            
//         } catch (e) {
//             alert('Ошибка при выходе');
//         }
//     }
        
        // подготовительная работа с чатами..

        async getChats() {
            const chats = await this.api.read();

            store.set('chats', chats);
        }

        async selectChat(id: number) {
            store.set('selectedChat', id);

            createConnection(); // создать подключение по websocket
        }
        // пример вложенности. если пользователь обновил какие-то данные, можно сделать 
        // оптимистичные апдейты..чтобы пользователь сразу видел изменеие: пример:
        async updateUsername(username: string) {
            const { username: oldUsername } = store.getState().user; // получить старый username из store
            
            store.set('user.username', username) // потом помещаем новый (пользователь сразу видит)

            const result = await this.api.update({ username }); // потом метод api для обновления на сервере

            if (!result) { // если результат на сервере неуспешный, то
                store.set('user.username', oldUsername); // возвращаем в состояние старый username
                // показать пользователю, что произошла ошибка, попробуйте еще раз
            }
        }


//     async getUser() {
//         try {
//             const user: apiUser = await this.api.read();

//             store.set('user', user);
//         } catch (e) {
//             alert('Ошибка при получении пользователя');
//         }
//     }
// }
