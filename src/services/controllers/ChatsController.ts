import ChatsAPI from "../api/ChatsAPI";
import store from "../Store";

class ChatsController {
    private api = new ChatsAPI;
    public socket!: WebSocket;
    private goPingPong!: number;

    async req<T>(req: () => Promise<T>) {
        store.set('user.isLoading', true);

        try {
            // console.log('------------request try')

            const res = await req();

            
            store.set('user.error', undefined);
            return res;
        } catch (e: unknown) {
            console.log('request catch')

            alert(e);
            store.set('user.error', e);
        } finally {
            // console.log('request finally');
            store.set('user.isLoading', false);
        }
    }

    async getChats(queryObj?: apiReqQueryChats) {
        // console.log('------------getChats start')
        try {
            const chats: apiChats[] = queryObj ? 
                await this.api.read(queryObj) : 
                await this.api.read();

            store.set('chats', chats)
        } catch (e) {
            console.error(e);
            store.set('chats.error', e);
        }
    }

    async getUsers(id: number, queryObj?: apiReqQueryChats) {
        // console.log('------------getUsers start')
        try {
            const users: apiChatUser[] = queryObj ? 
                await this.api.readUsers(id ,queryObj) : 
                await this.api.readUsers(id);
            
            store.set(`chatsUsers.${id}`, users);
            return users;
        } catch (e) {
            console.error(e);
            store.set('chats.error', e);
        }
    }

    // получить ЧАТЫ, ПОЛЬЗОВАТЕЛЕЙ и (в будущем аватары)
    async getChatsAndUsers(queryObj?: apiReqQueryChats) {
        // console.log('------------getChats start')
        try {
            const chats: apiChats[] = queryObj ? 
                await this.api.read(queryObj) : 
                await this.api.read();
            store.set('chats', chats)
            const chatsUsers: apiChatUser[][] = []
            for (const chat of chats) {
                const users = await this.api.readUsers( chat.id )
                chatsUsers.push( <any>users );
            }
            store.set('chatsUsers', chatsUsers)
            // console.log(store.getState())
        } catch (e) {
            console.log('------------getChats catch (error)', e);
            store.set('chats.error', e);
        }
    }

    async createChat(title: string): Promise<apiResCreateChat | any> {
        // console.log('------------createChat start')
        const res = await this.req(async () => {
            try {
                const res = await this.api.create(title);
                const chat = { id: res.id, title };
                
                const chats = store.getState().chats ?? new Array(0);
                if (chats.unshift) chats.unshift(chat)
                 else chats.push(chat);

                store.set('chats', chats);

                if (chat) return chat;
            } catch (e: any) {
                console.log(e);
                throw new Error(e.reason ?? e.message)
            }
        })
        return res;
    }

    async deleteChat(idChat: number) {
        // console.log('------------deleteChat start')
        const res = await this.req(async () => {
            try {
                const res = await this.api.deleteChat(idChat);
                // console.log('чат', store.getState().chats, idChat);
                const index = store.getState().chats.findIndex(
                    (chat: Record<string, any>) => {
                        if (!chat) return false;
                            else return chat.id === res.result.id
                    }
                );
                if (index !== -1) store.getState().chats[index] = null;
                return 1;
            } catch (e: any) {
                console.log(e);
                throw new Error(e.reason ?? e.message)
            }
        })
        return res;
    }

    async deleteUsersFromChat(usersData: apiReqUsersChat) {
        // console.log('------------deleteUsersFromChat start')
        await this.req(async () => {
            try {
                await this.api.deleteUsersFromChat(usersData)

                // удалить пользователей из чата в сторе по аналогии с добавлением
            } catch (e) {
                console.log(e);
            }
        })
    }

    async addUsersToChat(usersData: apiReqUsersChat) {
        // console.log('---------------addUsersToChat start')
        const res = await this.req(async () => {
            try {
                // console.log(usersData);
                /* const res =  */await this.api.addUsersToChat( usersData );
                // console.log(res);
                const chatUsers = await this.api.readUsers( usersData.chatId );
                
                // console.log(chatUsers);
                
                store.set(`chatsUsers.${usersData.chatId}`, chatUsers);
                return chatUsers;
            } catch (e) {
                console.log(e);
            }
        })
        return res;
    }


    async openChat(chatId: number): Promise<any> {
        try {
            this.closeChat();
            await this.getUsers(chatId)
            
            const res = await this.api.getChatToken(chatId);
            store.set('socket.activeChatId', chatId);
                        
            const userId = store.getState().user.data.id;
            const token = res.token;
            this.socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`);
            
            this.socket.addEventListener('open', async () => {
                this.goPingPong = setInterval(() => {
                    this.socket.send(JSON.stringify({type: "ping"}))
                }, 15000)

                console.log(`WEBSOCKET: соединение установлено [чат ${chatId}]`);
                store.remove('socket.messages');

                this.loadLastMessages();
            })

            this.socket.addEventListener('close', e => {
                this.goPingPong && clearInterval(this.goPingPong);
                store.remove('socket.messages');
                // console.log('PING PONG', this.goPingPong);
                if (e.wasClean) console.log(`WEBSOCKET: соединение закрыто [чат ${chatId}]`)
                    else {
                        console.log(`WEBSOCKET: срыв соединения [чат ${chatId}]. Переподключение.`);
                        setTimeout(() => {
                            this.openChat(chatId);
                        }, 500)
                    }
            })

            this.socket.addEventListener('message', e => {
                store.set('socketCheckUpdate', false)
                store.remove('socket.msgType')
                // console.log(e)
                const data: apiDataWebSocket[] | apiDataWebSocket = JSON.parse(e.data);
                let maxMsgId = 0;
                
                // если грузятся еще непрочитанные сообщения
                if (data instanceof Array) {
                    const arrUnreadMsgs: apiDataWebSocket[] = [];
                    if (data.length !== 0) {
                        for (const msg of data) {
                            if (msg.type === 'message') {
                                arrUnreadMsgs.push(msg);
                            }
                        }
                        // console.log(arrUnreadMsgs);
                        store.set('socket.messages', arrUnreadMsgs);
                        store.set('socket.msgType', 'unread')
                        store.set('socketCheckUpdate', true);
                        console.log('WEBSOCKET: получен пакет сообщений: ', data)
                        if (maxMsgId < data[data.length - 1].id) maxMsgId = data[data.length - 1].id;
                    }
                    if (data.length === 20) this.loadLastMessages(maxMsgId);
                } else 
                // иначе новое сообщение или сообщение пользователя
                if (data.type === 'message') {
                    store.set('socket.messages', [data]);
                    store.set('socket.msgType', 'new')
                    store.set('socketCheckUpdate', true);
                    console.log('WEBSOCKET: получено новое сообщение: ', data)
                }
            })

            this.socket.addEventListener('error', () => {
                console.log('websocket error')
            })
        } catch (e) {
            console.log('error', e)
        }
    }
    
    async loadLastMessages(offset = 0) {
        if (this.socket) {
            this.socket.send(JSON.stringify({
                content: offset.toString(),
                type: "get old"
            }))
        }
    }

    async sendNewMessage(text: string) {
        this.socket &&
            this.socket.send(JSON.stringify({
                content: text,
                type: 'message'
            }))        
    }

    closeChat() {
		store.set('socketCheckUpdate', false);
		store.remove('socket');
		this.closeWebSocket();
	}

    closeWebSocket() {
		this.socket && this.socket.close();
	}
}

export default new ChatsController();
