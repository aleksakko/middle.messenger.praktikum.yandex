import HTTPSender from "../HTTP";
import BaseAPI from "./base-api";

const chatMessagesAPIInstance = new HTTPSender('api/v1/messages');

class ChatMessagesAPI extends BaseAPI {

    request({id}) {
        // Здесь уже не нужно писать полный путь /api/v1/chats/// Здесь уже не нужно писать полный путь /api/v1/chats/
        return chatMessagesAPIInstance.get(`/${id}`);
    }

}
