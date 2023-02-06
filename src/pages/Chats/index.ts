import template from './chats.hbs';
import validateElem from '../../utils/validate';
import Block from '../../utils/Block';
import Alink from '../../components/Alink';
import Input from '../../components/Input';
import NavList from '../../components/NavList';
import ChatListUsersData from './chatListUsersData'; // список информации о чатах как раз будем получать
import Handlebars from 'handlebars';
import SectionWith from '../../components/SectionWith';

import jsonObj from './CHATSDATA.json';

interface ChatsPageProps {
    [key: string]: string;
}
export default class ChatsPage extends Block {
    constructor(props: ChatsPageProps) {
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
        
        this.kids.chatsList = new NavList({
            classNav: 'chats-column__chats',
            creator: 'Chats',
            chatsFieldData: UsersDataCompile,
            usersDataId: UsersDataId,
            parentBus: this.eventBus(), // передача EventBus'a с подписками родителя            
        });

        this.dataManipulate();


        this.kids.writeMessageCont= new SectionWith({
            className: ['write-message-cont', 'hidden'],
            creator: 'ChatsPage',
            ChatsPageParam: [
                {
                    tag: 'textarea',
                    idName: 'message',
                    events: {
                        'keydown': (e: KeyboardEvent) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                const target = e.target as HTMLTextAreaElement;
                                const resValidate = validateElem('message', target.value)
                                console.log(resValidate);
                                if (!resValidate[0]) console.log('Игнорирование')
                                    else console.log('Отправлено в открытый чат:', '\n', target.value);
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
                        'click': (e: any) => {
                            const fieldMessage = e.target.previousElementSibling;
                            const resValidate = validateElem('message', fieldMessage.value)
                            console.log(resValidate);
                            if (!resValidate[0]) console.log('Игнорирование')
                                else console.log('Отправлено в открытый чат:', '\n', fieldMessage.value);
                            fieldMessage.value = '';
                        }
                    }
                }
            ]
        })
        
        this.element.classList.add('chats-flex');
    }

    dataManipulate() {
        this.eventBus().on('clickAndGetChatId', (id) => {
            this.kids.writeMessageCont.element.classList.remove('hidden');
            const elemChat = document.querySelector('.stub-or-chat') as HTMLElement;
            console.log(jsonObj[id]);            
            elemChat.innerHTML = '<p>' + jsonObj[id].join('<br>') + '</p>'
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
                className: 'stub-or-chat', // заглушку скрывать (класс hidden), когда выбирается чат                
                message1: 'твой ход',
                message2: 'выбирай чат'
            }
        })
    }
}
