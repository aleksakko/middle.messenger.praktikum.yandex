import HTTPSender from "../../utils/HTTPTransport";
import BaseAPI from "./BaseAPI";

const authAPIInstance = new HTTPSender('api/v1/chats');

class ChatAPI extends BaseAPI {

    create() {
        // Здесь уже не нужно писать полный путь /api/v1/chats/// Здесь уже не нужно писать полный путь /api/v1/chats/
        return authAPIInstance.post('/', { title: 'string' })
            .then({user: {info}} => info);
    }

    request() {
        // Здесь уже не нужно писать полный путь /api/v1/chats/// Здесь уже не нужно писать полный путь /api/v1/chats/
        return authAPIInstance.post<LoginRequest, LoginResponse>('/login', user)
            .then(({user_id}) => user_id); // обрабатываем получение данных из сервиса далее
    }

}
