import template from './chats.hbs';
import validateElem from '../../utils/validate';
import Block from '../../utils/Block';
import Alink from '../../components/Alink';
import Input from '../../components/Input';
import NavList from './NavList';
import SectionWith from '../../components/SectionWith';
import Handlebars from 'handlebars';

import withStore from '../../services/withStore';
import httpData from '../../utils/httpData';
import store, { StoreEvents } from '../../services/Store';
import Button from '../../components/Button';
import ChatsController from '../../services/controllers/ChatsController';
import randomID from '../../utils/randomID';
import isEqual from '../../utils/isEqual';

interface ChatsPageProps {
    [key: string]: string;
}
export class ChatsPageBase extends Block {
    public static TODO = {
        CLICK_GET_CHAT_ID: 'click:get-chat-id',
        MESSAGE_WRITED: 'this-chat:message-writed',
        CLICK_DELETE_CHAT: 'click:delete-chat',
        CLICK_ADD_USER: 'click:add-user',
        CLICK_DELETE_USER: 'click:delete-user'
    }
    private CHATSDATA_msg_new!: Record<string, apiDataWebSocket[]>;
    private CHATSDATA_msg_unread!: Record<string, apiDataWebSocket[]>;
    
    constructor (props: ChatsPageProps) {
        super('main', props);
    }
    
    init() {
        

        this.kids.avaLink = new Alink({
            href: '/profile'
        })
        this.kids.searchInput = new Input({
            type: 'search',
            idName: 'search-chats',
            placeholder: 'найти',
        })
                
        

        this.kids.writeMessageCont = new SectionWith({
            className: ['write-message-cont', 'hidden'],
            creator: 'ChatsPage',
            ChatsPageParam: [
                {
                    tag: 'textarea',
                    idName: 'message',
                    value: '',
                    events: {
                        'keydown': (e: KeyboardEvent) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                const target = e.target as HTMLTextAreaElement;
                                const resValidate = validateElem('message', target.value)
                                console.log(resValidate);
                                if (!resValidate[0]) {
                                    console.log('Игнорирование отправки')
                                } else {
                                    console.log('Отправлено в открытый чат:', '\n', target.value);
                                    const elemChat = document.querySelector('.this-chat') as HTMLElement;
                                    
                                    this.eventBus().emit(ChatsPageBase.TODO.MESSAGE_WRITED, elemChat.dataset.id, target.value);
                                }
                                target.value = '';
                            }
                        }
                    }
                },
                {
                    tag: 'button',
                    label: 'написать',
                    idName: 'sendMessage',
                    className: [],
                    events: {
                        'click': (e: MouseEvent) => {
                            const target = e.target as HTMLButtonElement;
                            const fieldMessage = target.previousElementSibling as HTMLTextAreaElement;
                            const resValidate = validateElem('message', fieldMessage.value)
                            console.log(resValidate);
                            if (!resValidate[0]) {
                                console.log('Игнорирование отправки')
                            } else {
                                console.log('Отправлено в открытый чат:', '\n', fieldMessage.value);
                                const elemChat = document.querySelector('.this-chat') as HTMLElement;
                                
                                this.eventBus().emit(ChatsPageBase.TODO.MESSAGE_WRITED, elemChat.dataset.id, fieldMessage.value);
                            }
                            fieldMessage.value = '';
                            fieldMessage.focus();
                        }
                    }
                }
            ]
        })

        const tagsModel = 
            `<div class="ava-chat"></div>
            <div class="short-info">
                <span>{{title}} / id {{id}}</span>
                <span class="last-msg">{{last_msg_test}}{{last_message.content}}</span>
                <span class="users">{{users}}</span>
            </div>
            <div class="about">
                <button class="delete-chat">del</button>
                чатники
                <div>
                    <button class="delete-user">-</button>
                    <button class="add-user">+</button>
                </div>
            </div>`;

        const CHATSDATA_Compile: string[] = []; // здесь будут компилированные шаблоны DOM после шаблонизатора
        const CHATSDATA_Id: number[] = []; // здесь будут массив данных чата в таком же порядке
        this.CHATSDATA_msg_new = {};
        this.CHATSDATA_msg_unread = {};

        this.kids.addChat = new Button({
            type: 'button',
            label: '+',
            idName: 'add-chat',
            className: ['buttons__elem'],
            events: {
                'click': () => {

                    // ---------- СОЗДАНИЕ НОВОГО ЧАТА
                    const nameChat = prompt('Красивое (в будущем) окошко с надписью:\nВведите имя чата'); // сделать правильнее
                    nameChat ?
                        ChatsController.createChat(nameChat)
                        .then((res: apiResCreateChat) => {
                            
                            const dataNewElem = {
                                id: res.id,
                                title: res.title
                            }
                            this.CHATSDATA_msg_unread[res.id] = [];
                            this.CHATSDATA_msg_new[res.id] = [];
                            
                            CHATSDATA_Compile.unshift( Handlebars.compile(tagsModel)(dataNewElem) );
                            CHATSDATA_Id.unshift(dataNewElem.id);
        
                            this.kids.chatsList.setProps({
                                // аншифт объект поновой не передаю, так как при создании уже передалась ссылка на них
                                checkAddChat: true // указание, что добавляю новый чат с помощью кнопки +
                            })
                            this.kids.chatsList.eventBus().emit('flow:render')

                            // ChatsController.getChats().then..
                        }).catch(e => {
                            console.log(e)
                        })
                    : (typeof nameChat === 'string') ? alert('Имя не должно быть пустым') : null;
                }
            }
        })

        
        function getChats(this: ChatsPageBase) {
            ChatsController.getChats()
                .then(() => {
                    const chats: Record<string, any>[] = store.getState().chats;
                    if (chats) {
                        console.log(chats);
                        // компиляция шаблона и данных каждого элемента списка в массив и отправка его пропсами Инстансу
                        chats.forEach(chat => {
                            CHATSDATA_Compile.push( Handlebars.compile(tagsModel)(chat) );
                            CHATSDATA_Id.push(chat.id);
                            // объект с кешем чатов
                            // инициализируем на каждый чат пустой массив (для будущих сообщений)
                            this.CHATSDATA_msg_unread[chat.id] = [];
                            this.CHATSDATA_msg_new[chat.id] = [];
                        })
                        return chats;
                    } else {
                        getChats.call(this);
                    }
                }).then((chats) => {
                    if(chats){
                        this.dataChatManipulate();
                        this.kids.chatsList.setProps({randNumForUpdate:randomID(10)})                
                    }
                });
        }
        getChats.call(this);
        
        // Инициализация ЧатЛиста - создание инстанса НавигационногоСписка
        this.kids.chatsList = new NavList({
            classNav: 'chats-column__chats',
            creator: 'Chats',
            CHATSDATA_Compile: CHATSDATA_Compile,
            CHATSDATA_Id: CHATSDATA_Id,
            chatsBus: this.eventBus(), // передача родительского EventBus'a с подписками            
        })
        
        
        this.element.classList.add('chats-flex');
    }

    // метод - связывание навигационного списка, блока с данными активного чата и ввода
    // и подписки на соответствующие события (от списка к чату, от элемента написания к чату и т.д.)
    dataChatManipulate() {
        let checkHideStub = false,
            checkHideThisChat = true;
        
            // инициализация исохранение в замыкании - объект с кэшем чатов в форме {id: тэг <template> с детьми}
        // для эффективного DOM неиспользуемые ветви чатов будут здесь, а используемая будет отсюда доставаться
        const chatIdTemplate: Record<string, HTMLTemplateElement> = {};
        const chatIdCounter: Record<string, number> = {}; // счетчик, помогающий на каждый chatId считать количество сообщений
       
        let prevChatId: number;
        let activeChatId: number;
        let lastMessageObject: apiDataWebSocket;
        
        // подписка на новые сообщения активного чата из стора (из открытого вебсокета соответственно)
        store.on(StoreEvents.UPDATED, state => {

            if (state.socketCheckUpdate && state.socket?.messages) {

                activeChatId = state.socket.activeChatId;
                console.log(isEqual(lastMessageObject, state.socket.messages[0]))

                if (state.socket.msgType === 'unread') {
                    for (const msg of state.socket.messages) {
                        this.CHATSDATA_msg_unread[activeChatId].push(msg);
                    }
                    if (!isEqual(lastMessageObject, state.socket.messages[0]))
                        this.eventBus().emit(ChatsPageBase.TODO.CLICK_GET_CHAT_ID, activeChatId, state.socket.msgType)
                    lastMessageObject = this.CHATSDATA_msg_unread[activeChatId][0];
                    
                } else if (state.socket.msgType === 'new') {
                    this.CHATSDATA_msg_new[activeChatId].push(state.socket.messages[0])
                    lastMessageObject = this.CHATSDATA_msg_new[activeChatId][this.CHATSDATA_msg_new[activeChatId].length - 1];
                    this.eventBus().emit(ChatsPageBase.TODO.CLICK_GET_CHAT_ID, activeChatId, state.socket.msgType)
                }

                // перебираем сообщения в обратную сторону
                // for (let i = state.socket.messages.length - 1; i >= 0; i--) {
                // this.CHATSDATA[activeChatId].push(state.socket.messages[i].content);
                // }
            }
        })
        // ------------------------------------------------------
        /* используем здешний eventBus для отслеживания клика по чату из списка и
        изменения данных активного окна (.this-chat)
        подписка на событие "Клик по чату из навигационного списка и получение его id" */
        this.eventBus().on(ChatsPageBase.TODO.CLICK_GET_CHAT_ID, (chatId: number, type = '') => {
            // type = '', значит инициализация
            // type = 'from' - переход на этот чат с другого
            // type = 'unread', значит получаем непрочитанные сообщения
            // type = 'new', значит получаем новые сообщения

            // if (!checkUp) {
            //     this.CHATSDATA_msg_unread[chatId].length = 0;
            //     this.CHATSDATA_msg_new[chatId].length = 0;
            // }
            // alert(checkUp);
            // console.log(this.CHATSDATA_msg_new[chatId]);

            activeChatId = chatId;
            
            
            // ------- подкрашиваем выбранный элемент списка
            const elemOfList = document.querySelector(`[data-id="${chatId}"]`);
            // console.log(elemOfList);
            elemOfList?.classList.add('active');
            
            if (prevChatId && prevChatId !== chatId) {
                const prevElemOfList = document.querySelector(`[data-id="${prevChatId}"]`);
                prevElemOfList?.classList.remove('active');
            }
            
            // -------- скрытие заглушки, показ окна чата
            const elemStub = document.querySelector('.stub-chat') as HTMLElement;
            const elemChat = document.querySelector('.this-chat') as HTMLElement;
            
            if (!checkHideStub) {
                elemStub.classList.add('hidden');
                checkHideStub = true;
            }
            if (checkHideThisChat) {
                elemChat.classList.remove('hidden');
                this.kids.writeMessageCont.element.classList.remove('hidden');
                checkHideThisChat = false;
            }

            // ---------- логика - замена данных выбранного чата кэшем, если они есть + вебсокет
            // иначе получаем новые с сервера (ДОПисать получение сообщений, открытие вебсокета)            
            // const checkTemp = chatIdTemplate[chatId] ? true : false;
            // const temp = checkTemp ? chatIdTemplate[chatId] : document.createElement('template');

           

            const temp = chatIdTemplate[chatId] ?? document.createElement('template');
            if (type === 'unread') {                
                !chatIdCounter[chatId] && (chatIdCounter[chatId] = 0)
                const counter = chatIdCounter[chatId] - this.CHATSDATA_msg_new[chatId].length;
                console.log(counter);
                const messages = this.CHATSDATA_msg_unread[chatId];
                console.log(messages)
                console.log(chatIdCounter[chatId], this.CHATSDATA_msg_new)
                if (counter < messages.length) {
                    for (let i = counter - 1; i <= messages.length; i++) {
                        
                        const spanEl = document.createElement('SPAN');
                        spanEl.classList.add('msg');
                        spanEl.textContent = messages[i]?.content;
                        temp.content.prepend(spanEl);
                        const spanEltime = document.createElement('SPAN');
                        spanEltime.classList.add('msg-time');
                        const timeString = messages[i]?.time;
                        const date = new Date(timeString);
                        spanEltime.textContent = date.toLocaleString();
                        temp.content.prepend(spanEltime);
                        chatIdCounter[chatId]++;

                    }
                    chatIdCounter[chatId] += this.CHATSDATA_msg_new[chatId].length;
                    chatIdTemplate[chatId] = temp; // добавляем шаблон в кэш-template объект
                }
            }

            if (type === 'new') {  
                
                const spanEl = document.createElement('SPAN');
                spanEl.classList.add('msg');
                spanEl.textContent = this.CHATSDATA_msg_new[chatId][this.CHATSDATA_msg_new[chatId].length - 1]?.content;
                temp.content.append(spanEl);                        
                chatIdCounter[chatId]++;

                chatIdTemplate[chatId] = temp;

                // !chatIdCounter[chatId] && (chatIdCounter[chatId] = 0)
                // const counter = chatIdCounter[chatId] - this.CHATSDATA_msg_unread[chatId].length;
                // const messages = this.CHATSDATA_msg_new[chatId];
                // if (counter < messages.length) {
                //     for (let i = counter; i <= messages.length; i++) {
                        
                //         const spanEl = document.createElement('SPAN');
                //         spanEl.classList.add('msg');
                //         spanEl.textContent = messages[i]?.content;
                //         temp.content.append(spanEl);                        
                //         chatIdCounter[chatId]++;

                //     }
                //     chatIdTemplate[chatId] = temp; // добавляем шаблон в кэш-template объект
            //     }
            }
            
            // if (!checkTemp) {    
            //     this.CHATSDATA_msg_unread[chatId].forEach((msg: apiDataWebSocket) => {
            //         const spanEl = document.createElement('SPAN');
            //         spanEl.classList.add('msg');
            //         spanEl.textContent = msg.content;
            //         temp.content.append(spanEl);
            //         counter++;
            //     });
            //     chatIdTemplate[chatId] = temp; // добавляем шаблон в кэш-template объект
            // }            
            
            // если раньше был открыт чат, то переносим html-детей обратно в кэш-template объект перед очисткой (textContent = '')
            if (prevChatId && prevChatId !== chatId) {
                chatIdTemplate[prevChatId]?.content.replaceChildren(...Array.from(elemChat.children));
            }
            prevChatId = chatId;
            
            // очищаем и меняем родителя на реальный элемент .this-chat - новый контент появляется моментально
            // (в кэше остается одинокий элемент template)
            const elem = document.createElement('div');
            elem.replaceChildren(...Array.from(elemChat.children));
            if (type === 'new') elemChat.replaceChildren(...Array.from(elem.children), ...Array.from(temp.content.children))
                else elemChat.replaceChildren(...Array.from(temp.content.children), ...Array.from(elem.children))
            
            elemChat.dataset.id = chatId.toString();
            elemChat.scrollTop = elemChat.scrollHeight;
        })

        // -------------------------------------------
        // подписка на событие 'сообщение написано' с получением id чата и сообщения
        this.eventBus().on(ChatsPageBase.TODO.MESSAGE_WRITED, (id, msg) => {
            console.log(id);

            ChatsController.sendNewMessage(msg);
            
            // const elemChat = document.querySelector('.this-chat') as HTMLElement;
            // const spanEl = document.createElement('SPAN');
            // spanEl.classList.add('msg');
            // spanEl.textContent = msg;
            // elemChat.append(spanEl);

            // elemChat.scrollTop = elemChat.scrollHeight;
        })

        // --------------------------------------------
        this.eventBus().on(ChatsPageBase.TODO.CLICK_DELETE_CHAT, (id, chatId) => {
            delete this.CHATSDATA_msg_unread[chatId];
            delete this.CHATSDATA_msg_new[chatId];
            delete chatIdTemplate[chatId];
            delete chatIdCounter[chatId];
            (document.querySelector('.this-chat') as HTMLElement).textContent = '';
            id;
        })

    }
    
    render() {
        return this.compile(template, { 
            classChatsNav: 'chats-column',
            profile: {
                className: 'chats-column__profile',
                classAvaCont: 'avatar',
                classSearchCont: 'search',
                classButtons: 'buttons'
            },
            classChatsCont: 'chat-cont',
            stub: {
                className: 'stub-chat', // заглушку скрывать (класс hidden), когда выбирается чат                
                message1: 'твой ход',
                message2: 'выбирай чат'
            },
            classThisChat: 'this-chat hidden' 
        })
    }
}


// ----------- HOC --------------
const mapStateToProps = function (this: any, state: Record<string, any>) {
    const data = state.user?.data;
    
    if (this.kids != undefined) {
        
        // здесь кешируется изображение и лишний раз не меняется если в сторе оно уже есть
        const avatar = state.avatar ?? {};
        const elemAvatar = this.kids.avaLink.element.parentNode;
        if (avatar.base64img) {
            elemAvatar.style.backgroundImage = `url('${avatar.base64img}')`;
            elemAvatar.style.backgroundSize = 'cover';
        }

        if (data?.avatar) {
            if (!avatar.url || (avatar.url && avatar.url !== data?.avatar)) {
                httpData(`https://ya-praktikum.tech/api/v2/resources${data?.avatar}`, (result) => {
                    elemAvatar.style.backgroundImage = `url(${result})`;
                    elemAvatar.style.backgroundSize = 'cover';
                    store.set('avatar', {base64img: result, url: data?.avatar});
                })
            }
        }
    }

    return null;    
}

const ChatsPage = withStore(mapStateToProps)(ChatsPageBase);

export default ChatsPage;
