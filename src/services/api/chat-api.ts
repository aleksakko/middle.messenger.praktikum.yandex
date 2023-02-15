import HTTPSender from "../HTTP";
import BaseAPI from "./base-api";

const chatAPIInstance = new HTTPSender('api/v1/chats');

class ChatAPI extends BaseAPI {

    create() {
        // Здесь уже не нужно писать полный путь /api/v1/chats/// Здесь уже не нужно писать полный путь /api/v1/chats/
        return chatAPIInstance.post('/', { title: 'string' })
            .then({user: {info}} => info);
    }

    request() {
        // Здесь уже не нужно писать полный путь /api/v1/chats/// Здесь уже не нужно писать полный путь /api/v1/chats/
        return chatAPIInstance.get('/full');
    }

}
