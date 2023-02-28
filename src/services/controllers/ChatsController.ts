import ChatsAPI from "../api/ChatsAPI";
import store, { StoreEvents } from "../Store";
import UsersController from "./UsersController";

class ChatsController {
    private api = new ChatsAPI;

    async req<T>(req: () => Promise<T>) {
        store.set('user.isLoading', true);

        try {
            console.log('------------request try')

            const res = await req();

            
            store.set('user.error', undefined);
            return res;
        } catch (e: unknown) {
            console.log('request catch')

            store.set('user.error', e);
        } finally {
            console.log('request finally');
            store.set('user.isLoading', false);
        }
    }

    async getChats(queryObj?: apiReqQueryChats) {
        console.log('------------getChats start')
        try {
            const chats: apiChats[] = queryObj ? 
                await this.api.read(queryObj) : 
                await this.api.read();

            store.set('chats', chats)
        } catch (e) {
            console.log('------------getChats catch (error)', e);
            store.set('chats.error', e);
        }
    }

    // получить чаты, создателей и (в будущем аватары)
    async getChatsAndUsers(queryObj?: apiReqQueryChats) {
        console.log('------------getChats start')
        try {
            const chats: apiChats[] = queryObj ? 
                await this.api.read(queryObj) : 
                await this.api.read();

            store.set('chats', chats)
            const chatsUsers: apiChatUser[][] = []
            for (const chat of chats) {
                const users = await this.api.readUsers( chat.id)
                chatsUsers.push( <any>users );
            }
            store.set('chatsUsers', chatsUsers)
            console.log(store.getState())
        } catch (e) {
            console.log('------------getChats catch (error)', e);
            store.set('chats.error', e);
        }
    }

    async createChat(title: string): Promise<apiChats[]> {
        console.log('------------createChat start')
        const chats = await this.req(async () => {
            try {
                const chat = await this.api.create(title);
                
                const chats = store.getState().chats ?? [];
                chats.unshift(chat)
                store.set('chats', chats)

                return chats;
            } catch (e) {
                console.log(e);
                return e;
            }
        })
        return chats;
    }

    async deleteChat(idChat: number) {
        console.log('------------deleteChat start')
        await this.req(async () => {
            try {
                const res = await this.api.deleteChat(idChat);

                const index = store.getState().chats.findIndex(
                    (chat: Record<string, any>) => chat.id === res.result.id
                );
                if (index !== -1) store.getState().chats[index] = null;
                store.emit(StoreEvents.UPDATED, store.getState());
            } catch (e) {
                console.log(e);
            }
        })
    }

    async deleteUsersFromChat(usersData: apiReqUsersChat) {
        console.log('------------deleteUsersFromChat start')
        await this.req(async () => {
            try {
                await this.api.deleteUsersFromChat(usersData)

                // удалить пользователей из чата в сторе
            } catch (e) {
                console.log(e);
            }
        })
    }

    async addUsersToChat(usersData: apiReqUsersChat) {
        console.log('---------------addUsersToChat start')
        await this.req(async () => {
            try {
                await this.api.addUsersToChat(usersData)
            } catch (e) {
                console.log(e);
            }
        })
    }
}

export default new ChatsController();
        // подготовительная работа с чатами..

        // async getsChats() {
        //     const chats = await this.api.read();

        //     store.set('chats', chats);
        // }

        // async selectChat(id: number) {
        //     store.set('selectedChat', id);

        //     createConnection(); // создать подключение по websocket
        // }
        // пример вложенности. если пользователь обновил какие-то данные, можно сделать 
        // оптимистичные апдейты..чтобы пользователь сразу видел изменеие: пример:
        // async updateUsername(username: string) {
        //     const { username: oldUsername } = store.getState().user; // получить старый username из store
            
        //     store.set('user.username', username) // потом помещаем новый (пользователь сразу видит)

        //     const result = await this.api.update({ username }); // потом метод api для обновления на сервере

        //     if (!result) { // если результат на сервере неуспешный, то
        //         store.set('user.username', oldUsername); // возвращаем в состояние старый username
        //         // показать пользователю, что произошла ошибка, попробуйте еще раз
        //     }
        // }


//     async getUser() {
//         try {
//             const user: apiUser = await this.api.read();

//             store.set('user', user);
//         } catch (e) {
//             alert('Ошибка при получении пользователя');
//         }
//     }
// }
