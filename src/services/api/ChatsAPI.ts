import BaseAPI from "./BaseAPI";

export default class ChatsAPI extends BaseAPI {
    
    constructor() {
        super('/chats');
    }
    
    // get chats
    public read(queryObj?: apiReqQueryChats): Promise<apiChats[]> {
        return this.http.get('', queryObj);
    }

    // get chats users
    public readUsers(id: number, queryObj?: apiReqQueryChatUser): Promise<apiChatUser[]> {
        return this.http.get(`/${id}/users`, queryObj);
    }
    
    // create chat
    public create(title: string): Promise<{ id: number }> {
        return this.http.post('', { title });        
    }

    // delete chat by ID
    public deleteChat(chatId: number): Promise<apiDelChats> {
        return this.http.delete('', { chatId });
    }
    
    // delete users from chat
    public deleteUsersFromChat(usersData: apiReqUsersChat) {
        return this.http.delete('/users', usersData);
    }

    // add users to chat
    public addUsersToChat(userData: apiReqUsersChat): Promise<apiUser> {
        return this.http.put('/users', userData);
    }

    public getChatToken(chatId: number): Promise<{ token: string }> {
        return this.http.post(`/token/${chatId}`);
    }

    update = undefined;
    delete = undefined;
}
