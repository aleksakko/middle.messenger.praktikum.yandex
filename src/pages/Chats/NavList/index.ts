import template from './navList.hbs';
import Block from '../../../utils/Block';
import { ChatsPageBase } from '..';
import ChatsController from '../../../services/controllers/ChatsController';
import ModalChats from '../../../components/ModalChats';
import UsersController from '../../../services/controllers/UsersController';

interface NavListProps {
    [key: string]: any;
}

export default class NavList extends Block {
    private namesElementsOfNavList!: string[];
    private iGlob!: number;

    constructor(props: NavListProps) {
        super('nav', props);
    }
    
    init() {
        this.iGlob = 0;
        this.namesElementsOfNavList = []; // init важного массива, содержащий в нужном порядке названия элементов FieldLi... из this.kids
        
        this.element.classList.add(this.props.classNav);

        this.kids.modal = new ModalChats({
            chatsBus: this.props.chatsBus,
            events: {
                'click': (e: MouseEvent) => {
                    const target = e.target as HTMLElement;
                    const parent = target.parentElement as HTMLElement;
                    if (target.classList.contains('wrap-modal')) {
                        this.kids.modal.element.classList.add('hidden-vis');
                    }
                    if (parent.classList.contains('modal-chats__results__one') &&
                        target.tagName === 'BUTTON') {
                        
                        const addUserId = parent?.dataset.id;
                        
                        this.kids.modal.element.classList.add('hidden-vis');
                        
                        console.log(parent.dataset.id, target.tagName)
                        
                    }
                }
            }
        })
    }
    
    render() {   

        for (; this.iGlob < this.props.UsersDataCompile.length; this.iGlob++) {

            if (!this.namesElementsOfNavList.includes(`fieldLi${this.iGlob}`)) { // !!!
                
                const indexAddChat = this.props.checkAddChat ? 0 : this.iGlob; // если создание нового чата, то 0 для добавления из начала
                // console.log('add chat', this.iGlob)
                
                this.kids[`fieldLi${this.iGlob}`] = new Block('li', {
                    events: {
                        click: (e: MouseEvent) => {

                            const dataId: number = +((e.currentTarget as HTMLLIElement).getAttribute('data-id') as string);
                            const target = e.target as HTMLButtonElement;


                            // -------------- КЛИК ПО DELETE - УДАЛЕНИЕ ЧАТА
                            if (target.classList.contains('delete-chat')
                                && confirm('Красивое (в будущем) окошко с вопросом:\nТочно?')) {
                                console.log('delete-chat ', dataId)

                                ChatsController.deleteChat(dataId);

                                const iChat = this.props.UsersDataId.indexOf(dataId);
                                const forNodeDelete = this.namesElementsOfNavList[iChat];
                                    
                                // console.log(this.props.UsersDataCompile);
                                // console.log(this.props.UsersDataId);
                                // console.log(this.namesElementsOfNavList);
                                // console.log(dataId, iChat)
                                // console.log(typeof dataId, typeof this.props.UsersDataId[0])
                                    
                                delete this.namesElementsOfNavList[iChat]; // сначала удаляем из массива сопоставления для hbs и render'a
                                delete this.props.UsersDataCompile[iChat]; // затем данные полей
                                delete this.props.UsersDataId[iChat]; // и наконец из dataId сопоставлений
                                
                                this.eventBus().emit('flow:render');
                                
                                this.props.chatsBus.emit(ChatsPageBase.TODO.CLICK_DELETE_CHAT, iChat, dataId);
                                
                                // запуск api удаления и если успешно то все ок удаляем до последнего
                                delete this.kids[forNodeDelete];
                                // если не успешно то надо как-то возвратить все обратно
                                console.log(this.kids);

                            // --------------- КЛИК ПО ADD-USER - ДОБАВИТЬ ПОЛЬЗОВАТЕЛЯ В ЧАТ
                            } else if (target.classList.contains('add-user')) {
                                this.kids.modal.element.classList.remove('hidden-vis');
                                this.props.chatsBus.emit(ChatsPageBase.TODO.CLICK_ADD_USER, dataId);


                            // --------------- КЛИК ПО DELETE-USER - УДАЛИТЬ ПОЛЬЗОВАТЕЛЯ ИЗ ЧАТА
                            } else if (target.classList.contains('delete-user')) {
                                this.kids.modal.element.classList.remove('hidden-vis');
                                this.props.chatsBus.emit(ChatsPageBase.TODO.CLICK_DELETE_USER, dataId);

                            // --------------- ИНАЧЕ ПРОСТО КЛИК - ПОКАЗ ОКНА С ПОДГРУЗКОЙ ТУДА ДАННЫХ
                            } else {

                                // если не удаляем, то эмитим событие и передаем dataId (родителю)
                                this.props.chatsBus.emit(ChatsPageBase.TODO.CLICK_GET_CHAT_ID, dataId);

                            }
                        }
                    }
                });
                
                this.kids[`fieldLi${this.iGlob}`].element.innerHTML = this.props.UsersDataCompile[indexAddChat];
                this.kids[`fieldLi${this.iGlob}`].element.setAttribute('data-id', this.props.UsersDataId[indexAddChat]);
                
                
                if (this.props.checkAddChat) this.namesElementsOfNavList.unshift(`fieldLi${this.iGlob}`)
                    else this.namesElementsOfNavList.push(`fieldLi${this.iGlob}`) // если init render, то в конец
            }

        }

        return this.compile(template, { 
            arrNames: this.namesElementsOfNavList
        })
    }

    
    // render() {   

    //     for (; this.iGlob < this.props.UsersDataCompile.length; this.iGlob++) {

    //         if (!this.namesElementsOfNavList.includes(`fieldLi${this.iGlob}`)) { // !!!
                
    //             const indexAddChat = this.props.checkAddChat ? 0 : this.iGlob; // если создание нового чата, то 0 для добавления из начала
    //             // console.log('add chat', this.iGlob)
                
    //             this.kids[`fieldLi${this.iGlob}`] = new Block('li', {
    //                 events: {
    //                     click: (e: MouseEvent) => {
    //                         const dataId = (e.currentTarget as HTMLLIElement).getAttribute('data-id');

    //                         if ((e.target as HTMLButtonElement).classList.contains('delete-chat')
    //                             /* && confirm('Здесь должно быть окошко с вопросом:\nУдалить?') */) {

    //                             const iChat = this.propsUsersDataId.indexOf(dataId);
    //                             const forNodeDelete = this.namesElementsOfNavList[iChat];
                                    
    //                             // console.log(this.props.UsersDataCompile);
    //                             // console.log(this.propsUsersDataId);
    //                             // console.log(this.namesElementsOfNavList);
                                    
    //                             delete this.namesElementsOfNavList[iChat]; // сначала удаляем из важного
    //                             delete this.props.UsersDataCompile[iChat]; // затем данные полей
    //                             delete this.propsUsersDataId[iChat]; // и наконец из dataId сопоставлений
                                
    //                             this.eventBus().emit('flow:render');
                                
    //                             this.props.chatsBus.emit(ChatsPageBase.TODO.CLICK_DELETE_CHAT, iChat, dataId);
                                
    //                             // запуск api удаления и если успешно то все ок удаляем до последнего
    //                             delete this.kids[forNodeDelete];
    //                             // если не успешно то надо как-то возвратить все обратно
    //                             console.log(this.kids);
    //                         } else {

    //                             // если не удаляем, то эмитим событие и передаем dataId (родителю)
    //                             this.props.chatsBus.emit(ChatsPageBase.TODO.CLICK_GET_CHAT_ID, dataId);

    //                         }
    //                     }
    //                 }
    //             });
                
    //             this.kids[`fieldLi${this.iGlob}`].element.innerHTML = this.props.UsersDataCompile[indexAddChat];
    //             this.kids[`fieldLi${this.iGlob}`].element.setAttribute('data-id', this.propsUsersDataId[indexAddChat]);
                
                
    //             if (this.props.checkAddChat) this.namesElementsOfNavList.unshift(`fieldLi${this.iGlob}`)
    //                 else this.namesElementsOfNavList.push(`fieldLi${this.iGlob}`) // если init render, то в конец
    //         }

    //     }

    //     return this.compile(template, { 
    //         arrNames: this.namesElementsOfNavList
    //     })
    // }
}
