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

interface ChatsPageProps {
    [key: string]: string;
}
export default class ChatsPage extends Block {
    
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
        
        
        // Инициализация ЧатЛиста - создание инстанса НавигационногоСписка
        // компиляция шаблона и данных каждого элемента списка в массив и отправка его пропсами Инстансу 
        const tagsModel = 
        `<div class="ava-chat"></div>
        <div class="short-info"><span>{{nickname}}</span><span>{{partchat}}</span></div>
        <div class="about"><span>{{about}}</span></div>`;
        
        const UsersDataCompile: string[] = [];
        const UsersDataId: string[] = [];
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
            parentBus: this.eventBus(), // передача EventBus'a с подписками родителя            
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
    }
    
    render() {
        // console.log('render Chats');        
        return this.compile(template, { 
            classChatsNav: 'chats-column',
            profile: {
                className: 'chats-column__profile',
                classAvaCont: 'avatar',
                classSearchCont: 'search'
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
