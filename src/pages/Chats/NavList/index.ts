import template from './navList.hbs';
import Block from '../../../utils/Block';
import { ChatsPageBase } from '..';
import ChatsController from '../../../services/controllers/ChatsController';
import ModalChats from '../../../components/ModalChats';
import store from '../../../services/Store';

interface NavListProps {
    [key: string]: any;
}

export default class NavList extends Block {
    private namesElementsOfNavList!: string[];
    private iGlob!: number;
    private activeChatId!: number;
    private activeChatElem!: HTMLElement;

    constructor(props: NavListProps) {
        super('nav', props);
    }
    
    init() {
        this.iGlob = 0;
        this.namesElementsOfNavList = []; // init важного массива, содержащий в нужном порядке названия элементов FieldLi... из this.kids
        this.activeChatId = -1;
        
        this.element.classList.add(this.props.classNav);

        this.kids.modal = new ModalChats({
            chatsBus: this.props.chatsBus,
            events: {

                // обработка взаимодействия с модальным окном списка чатов
                'click': (e: MouseEvent) => {
                    const target = e.target as HTMLElement;
                    const parent = target.parentElement as HTMLElement;
                    const thisUser = store.getState().user.data;
                    
            // -------------если клик по затемненной области модального окна, то закрываем его
                    if (target.classList.contains('wrap-modal')) {
                        this.kids.modal.element.classList.add('hidden-vis');
                    } else

            // -------------если клик по Кнопке для добавления юзера
                    if (parent.classList.contains('modal-chats__results__add') &&
                        target.tagName === 'BUTTON') {

                        // то формируем запрос для добавления юзера
                        const usersData = {
                            users: [+(parent.dataset.id as string)],
                            chatId: this.activeChatId
                        }

                        // отправляем
                        ChatsController.addUsersToChat(usersData as apiReqUsersChat)
                            .then(chatUsers => {
                                
                                const usersElem = this.activeChatElem.querySelector('.users')
                                const users = [];
                                if (chatUsers && usersElem) {
                                    for (const user of chatUsers) {
                                        if (user.login === thisUser.login) 0
                                            else users.push(user.login)
                                    }
                                    // временная вставка вариантов в предыдущего соседа - <span>
                                    (parent.parentElement as any).previousElementSibling.textContent
                                    += `${target.nextElementSibling?.textContent} | `;
                                    
                                    // добавляем напрямую в элемент без обновления компонента
                                    usersElem.textContent = users.join(' | ');
                                }                                
                            })
                            .catch(e => console.error(e.message))
                        
                        //setTimeout(() => this.kids.modal.element.classList.add('hidden-vis'), 500);
                        
                        // this.props.chatsBus.emit(ChatsPageBase.TODO.CLICK_ADD_USER, this.activeChatId);

                        // console.log(this.activeChatElem.querySelector('.users'));

                        // const iChatInList = this.props.CHATSDATA_Id.indexOf(this.activeChatId);
                        
                        // const addUserId = parent?.dataset.id;
                        
                        
                        // console.log('id чата: ', this.activeChatId)
                        // console.log("id выбранного user'а ", +(parent.dataset.id as string))
                        
                    } else

            // -------------если клик по Кнопке для удаления юзера
                    if (parent.classList.contains('modal-chats__results__delete') &&
                        target.tagName === 'BUTTON') {

                        // то аналогично формируем запрос, отправляем
                        const usersData = {
                            users: [+(parent.dataset.id as string)],
                            chatId: this.activeChatId
                        }

                        ChatsController.deleteUsersFromChat(usersData as apiReqUsersChat)
                            .then(() => {

                                ChatsController.getUsers(this.activeChatId)
                                    .then(chatUsers => {
                                        const usersElem = this.activeChatElem.querySelector('.users')
                                        const users = [];
                                        if (chatUsers && usersElem) {
                                            for (const user of chatUsers) {
                                                if (user.login === thisUser.login) 0
                                                    else users.push(user.login)
                                            }

                                            usersElem.textContent = users.join(' | ');
                                            parent.remove();
                                        }
                                    })

                            })
                            .catch(e => console.error(e.message))
                    }
                }
                
            }
        })
    }
    
    render() {   

        for (; this.iGlob < this.props.CHATSDATA_Compile.length; this.iGlob++) {

            if (!this.namesElementsOfNavList.includes(`fieldLi${this.iGlob}`)) {
                
                const indexAddChat = this.props.checkAddChat ? 0 : this.iGlob; // если создание нового чата, то 0 для добавления из начала
                
                this.kids[`fieldLi${this.iGlob}`] = new Block('li', {
                    events: {

                        // навешиваем на (каждый) чат-элемент списка Обработчики с его элементами по клику 
                        click: (e: MouseEvent) => {
                            
                            this.activeChatElem = e.currentTarget as HTMLElement;
                            const chatId: number = +(this.activeChatElem.getAttribute('data-id') as string);
                            const target = e.target as HTMLButtonElement;


                            // -------------- КЛИК ПО DELETE - УДАЛЕНИЕ ЧАТА
                            if (target.classList.contains('delete-chat')
                                && confirm('Красивое (в будущем) окошко с вопросом:\nТочно?')) {
                                console.log('delete-chat ', chatId)

                                // сделать здесь позже оптимистичное удаление, а пока с проверкой и задержкой ожидания
                                ChatsController.deleteChat(chatId)
                                    .then(res => {
                                        if (!res) return
                                            
                                            const iChat = this.props.CHATSDATA_Id.indexOf(chatId);
                                            const forNodeDelete = this.namesElementsOfNavList[iChat];
                                                
                                            delete this.namesElementsOfNavList[iChat]; // сначала удаляем из массива сопоставления для hbs и render'a
                                            delete this.props.CHATSDATA_Compile[iChat]; // затем данные полей
                                            delete this.props.CHATSDATA_Id[iChat]; // и наконец из chatId сопоставлений
                                            
                                            this.eventBus().emit('flow:render');
                                            
                                            this.props.chatsBus.emit(ChatsPageBase.TODO.CLICK_DELETE_CHAT, iChat, chatId);
                                            
                                            delete this.kids[forNodeDelete];

                                    }).catch(e => console.log(e))


                            // --------------- КЛИК ПО ADD-USER - АКТИВИРУЕМ ОКНО ДЛЯ ДОБАВЛЕНИЯ ПОЛЬЗОВАТЕЛЕЙ В ЧАТ
                            } else if (target.classList.contains('add-user')) {
                                this.kids.modal.element.classList.remove('hidden-vis');
                                this.kids.modal.kids.inputSearch.element.classList.remove('hidden');
                                
                                this.props.chatsBus.emit(ChatsPageBase.TODO.CLICK_ADD_USER, chatId);
                                
                                this.activeChatId = chatId; // передаем Id чата в активный элемент для использования его при добавлении


                            // --------------- КЛИК ПО DELETE-USER - УДАЛИТЬ ПОЛЬЗОВАТЕЛЯ ИЗ ЧАТА
                            } else if (target.classList.contains('delete-user')) {
                                this.kids.modal.element.classList.remove('hidden-vis');
                                this.kids.modal.kids.inputSearch.element.classList.add('hidden');
                                
                                this.props.chatsBus.emit(ChatsPageBase.TODO.CLICK_DELETE_USER, chatId);
                                
                                this.activeChatId = chatId;

                            // --------------- ИНАЧЕ ЭТО ПРОСТО КЛИК - ЗНАЧИТ ПОКАЗ ОКНА С ПОДГРУЗКОЙ ТУДА ДАННЫХ
                            } else {
                                
                                ChatsController.openChat(chatId) // открываем новый сокет (старый автоматически закроется в методе)
                                this.props.chatsBus.emit(ChatsPageBase.TODO.CLICK_GET_CHAT_ID, chatId);

                            }
                        }
                    }
                });
                
                this.kids[`fieldLi${this.iGlob}`].element.innerHTML = this.props.CHATSDATA_Compile[indexAddChat];
                this.kids[`fieldLi${this.iGlob}`].element.setAttribute('data-id', this.props.CHATSDATA_Id[indexAddChat]);
                
                
                if (this.props.checkAddChat) this.namesElementsOfNavList.unshift(`fieldLi${this.iGlob}`)
                    else this.namesElementsOfNavList.push(`fieldLi${this.iGlob}`) // если init render, то в конец
            }

        }

        return this.compile(template, { 
            arrNames: this.namesElementsOfNavList
        })
    }

    
    // render() {   

    //     for (; this.iGlob < this.props.CHATSDATA_Compile.length; this.iGlob++) {

    //         if (!this.namesElementsOfNavList.includes(`fieldLi${this.iGlob}`)) { // !!!
                
    //             const indexAddChat = this.props.checkAddChat ? 0 : this.iGlob; // если создание нового чата, то 0 для добавления из начала
    //             // console.log('add chat', this.iGlob)
                
    //             this.kids[`fieldLi${this.iGlob}`] = new Block('li', {
    //                 events: {
    //                     click: (e: MouseEvent) => {
    //                         const chatId = (e.currentTarget as HTMLLIElement).getAttribute('data-id');

    //                         if ((e.target as HTMLButtonElement).classList.contains('delete-chat')
    //                             /* && confirm('Здесь должно быть окошко с вопросом:\nУдалить?') */) {

    //                             const iChat = this.props.CHATSDATA_Id.indexOf(chatId);
    //                             const forNodeDelete = this.namesElementsOfNavList[iChat];
                                    
    //                             // console.log(this.props.CHATSDATA_Compile);
    //                             // console.log(this.props.CHATSDATA_Id);
    //                             // console.log(this.namesElementsOfNavList);
                                    
    //                             delete this.namesElementsOfNavList[iChat]; // сначала удаляем из важного
    //                             delete this.props.CHATSDATA_Compile[iChat]; // затем данные полей
    //                             delete this.props.CHATSDATA_Id[iChat]; // и наконец из chatId сопоставлений
                                
    //                             this.eventBus().emit('flow:render');
                                
    //                             this.props.chatsBus.emit(ChatsPageBase.TODO.CLICK_DELETE_CHAT, iChat, chatId);
                                
    //                             // запуск api удаления и если успешно то все ок удаляем до последнего
    //                             delete this.kids[forNodeDelete];
    //                             // если не успешно то надо как-то возвратить все обратно
    //                             console.log(this.kids);
    //                         } else {

    //                             // если не удаляем, то эмитим событие и передаем chatId (родителю)
    //                             this.props.chatsBus.emit(ChatsPageBase.TODO.CLICK_GET_CHAT_ID, chatId);

    //                         }
    //                     }
    //                 }
    //             });
                
    //             this.kids[`fieldLi${this.iGlob}`].element.innerHTML = this.props.CHATSDATA_Compile[indexAddChat];
    //             this.kids[`fieldLi${this.iGlob}`].element.setAttribute('data-id', this.props.CHATSDATA_Id[indexAddChat]);
                
                
    //             if (this.props.checkAddChat) this.namesElementsOfNavList.unshift(`fieldLi${this.iGlob}`)
    //                 else this.namesElementsOfNavList.push(`fieldLi${this.iGlob}`) // если init render, то в конец
    //         }

    //     }

    //     return this.compile(template, { 
    //         arrNames: this.namesElementsOfNavList
    //     })
    // }
}
