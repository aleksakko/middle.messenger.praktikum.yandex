import template from './chats.hbs';
import validateElem from '../../utils/validate';
import Block from '../../utils/Block';
import Alink from '../../components/Alink';
import Input from '../../components/Input';
import NavList from './NavList';
import SectionWith from '../../components/SectionWith';
import Handlebars from 'handlebars';

import TESTDATA_ChatList from './TESTDATA_USERS'; // список информации о чатах как раз будем получать
import CHATSDATA from './TESTDATA_CHATS.json'; // ветви сообщений чатов
import withStore from '../../services/withStore';
import httpData from '../../utils/httpData';
import store, { StoreEvents } from '../../services/Store';
import Button from '../../components/Button';
import ChatsController from '../../services/controllers/ChatsController';
import randomID from '../../utils/randomID';

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
                <span>{{title}} / chat_id {{id}}</span>
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

        const UsersDataCompile: string[] = [];
        const UsersDataId: number[] = [];

        this.kids.addChat = new Button({
            type: 'button',
            label: '+',
            idName: 'add-chat',
            className: ['buttons__elem'],
            events: {
                'click': () => {
                    const nameChat = prompt('Красивое (в будущем) окошко с надписью:\nВведите имя чата') ?? 'чат без имени'; // сделать правильнее

                    ChatsController.createChat(nameChat)
                        .then((res: apiResCreateChat) => {                            
                            const id = TESTDATA_ChatList.length;
                            const data = store.getState().user.data;
                            
                            const dataNewElem = {
                                id: res[0].id,
                                title: res[0].title,
                                users: data.login
                            }
                            TESTDATA_ChatList.unshift(dataNewElem);
                            CHATSDATA[res[0].id] = [`ПРИМЕР СООБЩЕНИЯ ${res[0].id}`];
                            
                            UsersDataCompile.unshift( Handlebars.compile(tagsModel)(dataNewElem) );
                            UsersDataId.unshift(dataNewElem.id);
        
                            this.kids.chatsList.setProps({
                                // аншифт объект поновой не передаю, так как при создании уже передалась ссылка на них
                                checkAddChat: true // указание, что добавляю новый чат с помощью кнопки +
                            })
                            this.kids.chatsList.eventBus().emit('flow:render')

                            // ChatsController.getChats().then..
                        }).catch(e => {
                            console.log(e)
                        })

                }
            }
        })

        //partchat временно из тестового, надо достать nickname и пробежаться по ним
         //пока вместо <div class="about"><span>{{about}}</span></div>

        // Инициализация ЧатЛиста - создание инстанса НавигационногоСписка
        this.kids.chatsList = new NavList({
            classNav: 'chats-column__chats',
            creator: 'Chats',
            UsersDataCompile: UsersDataCompile,
            UsersDataId: UsersDataId,
            chatsBus: this.eventBus(), // передача родительского EventBus'a с подписками            
        })

        ChatsController.getChats()
            .then(() => {
                const chats: Record<string, any>[] = store.getState().chats ?? [];
                
                // компиляция шаблона и данных каждого элемента списка в массив и отправка его пропсами Инстансу                
                chats.forEach(chat => {
                    UsersDataCompile.push( Handlebars.compile(tagsModel)(chat) );
                    UsersDataId.push(chat.id);
                    // сделать статический объект с кешем чатов
                    CHATSDATA[chat.id] = [`строка чата ${chat.id}`];
                })   
                TESTDATA_ChatList.forEach(user => {
                    UsersDataCompile.push( Handlebars.compile(tagsModel)(user) );
                    UsersDataId.push(user.id);
                })
                    return chats;
            }).then((chats) => {

                this.dataChatManipulate();
                this.kids.chatsList.setProps({randNumForUpdate:randomID(10)})

                

            });
        
        this.element.classList.add('chats-flex');
    }

    // метод - связывание навигационного списка, блока с данными активного чата и ввода
    // и подписки на соответствующие события (от списка к чату, от элемента написания к чату и т.д.)
    dataChatManipulate() {
        let checkHideStub = false,
            checkHideThisChat = true;
        // инициализация и сохранение в замыкании - объект с кэшем чатов в форме {id: тэг <template> с детьми}
        // для эффективного DOM неиспользуемые ветви чатов будут здесь, а используемая будет отсюда доставаться
        const chatIdTemplate: Record<string, HTMLTemplateElement> = {};
        let prevId: string;
        
        // ------------------------------------------------------
        /* используем здешний eventBus для отслеживания клика по чату из списка и
        изменения данных активного окна (.this-chat)
        подписка на событие "Клик по чату из навигационного списка и получение его id" */
        this.eventBus().on(ChatsPageBase.TODO.CLICK_GET_CHAT_ID, (id) => {
            
            console.log(id, this.kids);
            
            // ------- подкрашиваем выбранный элемент списка
            const elemOfList = document.querySelector(`[data-id="${id}"]`);
            // console.log(elemOfList);
            elemOfList?.classList.add('active');
            
            if (prevId && prevId !== id) {
                const prevElemOfList = document.querySelector(`[data-id="${prevId}"]`);
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
            const checkTemp = chatIdTemplate[id] ? true : false;
            const temp = checkTemp ? chatIdTemplate[id] : document.createElement('template');
                        
            //console.log(CHATSDATA)
            if (!checkTemp) {
                CHATSDATA[id].forEach((msg: string) => {
                    const spanEl = document.createElement('SPAN');
                    spanEl.classList.add('msg');
                    spanEl.textContent = msg;
                    temp.content.append(spanEl);
                });
                chatIdTemplate[id] = temp; // добавляем шаблон в кэш-template объект
            }            
            
            // если раньше был открыт чат, то переносим html-детей обратно в кэш-template объект перед очисткой (textContent = '')
            if (prevId) {
                chatIdTemplate[prevId].content.replaceChildren(...Array.from(elemChat.children));
            }
            prevId = id;
            
            // очищаем и меняем родителя на реальный элемент .this-chat - новый контент появляется моментально
            // (в кэше остается одинокий элемент template)
            elemChat.textContent = '';
            elemChat.replaceChildren(...Array.from(temp.content.children));
            
            elemChat.dataset.id = id;
            elemChat.scrollTop = elemChat.scrollHeight;
        })

        // -------------------------------------------
        // подписка на событие 'сообщение написано' с получением id чата и сообщения
        this.eventBus().on(ChatsPageBase.TODO.MESSAGE_WRITED, (id, msg) => {
            console.log(id);
            
            const elemChat = document.querySelector('.this-chat') as HTMLElement;
            const spanEl = document.createElement('SPAN');
            spanEl.classList.add('msg');
            spanEl.textContent = msg;
            elemChat.append(spanEl);

            elemChat.scrollTop = elemChat.scrollHeight;
        })

        // --------------------------------------------
        this.eventBus().on(ChatsPageBase.TODO.CLICK_DELETE_CHAT, (id, idName) => {
            delete CHATSDATA[idName];
            delete TESTDATA_ChatList[id];
        })
    }
    
    render() {
        // console.log('render Chats');        
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

let oldData: Record<string, any>;

const mapStateToProps = function (this: any, state: Record<string, any>) {
    const data = state.user?.data;
    // console.log(data ? state.chats : null)
    

    if (this.kids != undefined) {
        
        // if (!isEqual(oldData, data)) {
        //     const arrElems = document.getElementsByClassName('profile-cont__field');
        //     setTimeout(() => {
        //         arrElems[1].children[1].textContent = data?.email;
        //         arrElems[2].children[1].textContent = data?.login
        //         arrElems[3].children[1].textContent = data?.first_name
        //         arrElems[4].children[1].textContent = data?.second_name
        //         arrElems[5].children[1].textContent = data?.display_name
        //         arrElems[6].children[1].textContent = data?.phone
        //     }, 0)
        // }
        
        // здесь кешируется изображение и лишний раз не меняется если в сторе оно уже есть
        const avatar = state.avatar ?? {};
        const elemAvatar = this.kids.avaLink.element.parentNode;
        if (avatar.base64img/*  && data?.avatar === avatar.url */) {
            elemAvatar.style.backgroundImage = `url('${avatar.base64img}')`;
        }

        if (data?.avatar) {
            if (!avatar.url || (avatar.url && avatar.url !== data?.avatar)) {
                httpData(`https://ya-praktikum.tech/api/v2/resources${data?.avatar}`, (result) => {
                    elemAvatar.style.backgroundImage = `url(${result})`;
                    store.set('avatar', {base64img: result, url: data?.avatar});
                })
            }
        }

        oldData = Object.assign({}, data);
        console.log('обновление', this.kids.writeMessageCont.creator);
    } else {
        //console.log('мимо', this)
    }
    return null;    
}

const ChatsPage = withStore(mapStateToProps)(ChatsPageBase);

export default ChatsPage;
