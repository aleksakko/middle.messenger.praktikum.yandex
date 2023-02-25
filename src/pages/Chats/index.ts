import template from './chats.hbs';
import validateElem from '../../utils/validate';
import Block from '../../utils/Block';
import Alink from '../../components/Alink';
import Input from '../../components/Input';
import NavList from '../../components/NavList';
import SectionWith from '../../components/SectionWith';
import Handlebars from 'handlebars';

import ChatListUsersData from './chatListUsersData'; // список информации о чатах как раз будем получать
import CHATSDATA from './CHATSDATA.json'; // ветви сообщений чатов
import withStore from '../../services/withStore';
import httpData from '../../utils/httpData';
import store from '../../services/Store';
import Button from '../../components/Button';

interface ChatsPageProps {
    [key: string]: string;
}
class ChatsPageBase extends Block {
    
    constructor (props: ChatsPageProps) {
        super('main', props);
        //console.log('constructor Reg после super');
    }
    
    init() {   
        // console.log('init Chats');
        
        this.kids.avaLink = new Alink({
            href: '/profile'
        })
        this.kids.searchInput = new Input({
            type: 'search',
            idName: 'search',
            placeholder: 'найти',
        })

        const tagsModel = `<div class="ava-chat"></div>
            <div class="short-info"><span>{{nickname}}</span><span>{{partchat}}</span></div>
            <div class="about"><button class="delete-chat">-</button></div>`; //пока вместо <div class="about"><span>{{about}}</span></div>
        const UsersDataCompile: string[] = [];
        const UsersDataId: string[] = [];

        this.kids.addChat = new Button({
            type: 'button',
            label: '+',
            idName: 'add-chat',
            className: ['buttons__elem'],
            events: {
                'click': () => {
                    const id = ChatListUsersData.length;
                    const dataNewElem = {
                        id: 'chat' + id,
                        nickname: 'new Chat ' + id,
                        partchat: '',
                        about: null
                    }
                    ChatListUsersData.unshift(dataNewElem);
                    CHATSDATA['chat' + id] = [];
                    
                    UsersDataCompile.unshift( Handlebars.compile(tagsModel)(dataNewElem) );
                    UsersDataId.unshift(dataNewElem.id);

                    this.kids.chatsList.setProps({
                        // аншифт объект поновой не передаю, так как при создании уже передалась ссылка на них
                        checkAddChat: true // указание, что добавляю новый чат с помощью кнопки +
                    })
                    this.kids.chatsList.eventBus().emit('flow:render')
                }
            }
        })
        
        // Инициализация ЧатЛиста - создание инстанса НавигационногоСписка
        // компиляция шаблона и данных каждого элемента списка в массив и отправка его пропсами Инстансу
        
        ChatListUsersData.unshift({ // этот объект импортируется изначально из модуля рядом
            id: `chat${ChatListUsersData.length}`,
            nickname: '',
            partchat: '',
            about: null
        })
        CHATSDATA[ChatListUsersData[0].id] = []
        ChatListUsersData.forEach(user => {
            UsersDataCompile.push( Handlebars.compile(tagsModel)(user) );
            UsersDataId.push(user.id);
        })

        this.dataChatManipulate();

        this.kids.chatsList = new NavList({
            classNav: 'chats-column__chats',
            creator: 'Chats',
            chatsFieldData: UsersDataCompile,
            usersDataId: UsersDataId,
            parentBus: this.eventBus(), // передача родительского EventBus'a с подписками            
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
                                    
                                    this.eventBus().emit('MESSAGE_WRITED', elemChat.dataset.id, target.value);
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
                                
                                this.eventBus().emit('MESSAGE_WRITED', elemChat.dataset.id, fieldMessage.value);
                            }
                            fieldMessage.value = '';
                            fieldMessage.focus();
                        }
                    }
                }
            ]
        })
        
        this.element.classList.add('chats-flex');
    }

    // метод - связывание навигационного списка, блока с данными активного чата и ввода
    // и подписки на соответствующие события (от списка к чату, от элемента написания к чату и т.д.)
    dataChatManipulate() {
        let checkHideStub = false,
            checkHideThisChat = true;
        // инициализация и сохранение в замыкании - объект с кэшем чатов в форме {id: <template> с детьми}
        const chatIdTemplate: Record<string, HTMLTemplateElement> = {};
        let prevId: string;
        
        /* используем здешний eventBus для отслеживания клика по чату из списка и
        изменения данных активного окна (.this-chat)
        подписка на событие "Клик по чату из навигационного списка и получение его id"
        для эффективного DOM переносим неиспользуемые ветви чатов в кэш чатов, доставая оттуда используемые */
        this.eventBus().on('CLICK_GET_CHAT_ID', (id) => {
            
            console.log(id);
            
            const elemOfList = document.querySelector(`[data-id="${id}"]`);
            elemOfList?.classList.add('active');
            if (prevId) {
                const prevElemOfList = document.querySelector(`[data-id="${prevId}"]`);
                prevElemOfList?.classList.remove('active');
            }
            console.log(elemOfList);
            
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
            
            const checkTemp = chatIdTemplate[id] ? true : false;
            const temp = checkTemp ? chatIdTemplate[id] : document.createElement('template');
                        
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
            // очищаем и переносим детей (ссылки) из шаблона (в кэше остается только элемент template)
            elemChat.textContent = '';
            elemChat.replaceChildren(...Array.from(temp.content.children));
            
            elemChat.dataset.id = id;
            elemChat.scrollTop = elemChat.scrollHeight;
        })

        // подписка на событие 'сообщение написано' с получением id чата и сообщения
        this.eventBus().on('MESSAGE_WRITED', (id, msg) => {
            console.log(id);
            
            const elemChat = document.querySelector('.this-chat') as HTMLElement;
            const spanEl = document.createElement('SPAN');
            spanEl.classList.add('msg');
            spanEl.textContent = msg;
            elemChat.append(spanEl);

            elemChat.scrollTop = elemChat.scrollHeight;
        })

        this.eventBus().on('CLICK_DELETE_CHAT', (id, idName) => {
            delete CHATSDATA[idName];
            delete ChatListUsersData[id];
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
