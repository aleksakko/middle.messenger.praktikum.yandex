import template from './navList.hbs';
import Block from '../../../utils/Block';

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
    }
    
    render() {   

        for (; this.iGlob < this.props.chatsFieldData.length; this.iGlob++) {

            if (!this.namesElementsOfNavList.includes(`fieldLi${this.iGlob}`)) { // !!!
                
                const indexAddChat = this.props.checkAddChat ? 0 : this.iGlob; // если создание нового чата, то 0 для добавления из начала
                // console.log('add chat', this.iGlob)
                
                this.kids[`fieldLi${this.iGlob}`] = new Block('li', {
                    events: {
                        click: (e: MouseEvent) => {
                            const dataId = (e.currentTarget as HTMLLIElement).getAttribute('data-id');

                            if ((e.target as HTMLButtonElement).classList.contains('delete-chat')
                                /* && confirm('Здесь должно быть окошко с вопросом:\nУдалить?') */) {

                                const iChat = this.props.usersDataId.indexOf(dataId);
                                const forNodeDelete = this.namesElementsOfNavList[iChat];
                                    
                                // console.log(this.props.chatsFieldData);
                                // console.log(this.props.usersDataId);
                                // console.log(this.namesElementsOfNavList);
                                    
                                delete this.namesElementsOfNavList[iChat]; // сначала удаляем из важного
                                delete this.props.chatsFieldData[iChat]; // затем данные полей
                                delete this.props.usersDataId[iChat]; // и наконец из dataId сопоставлений
                                
                                this.eventBus().emit('flow:render');
                                
                                this.props.parentBus.emit('CLICK_DELETE_CHAT', iChat, dataId);
                                
                                // запуск api удаления и если успешно то все ок удаляем до последнего
                                delete this.kids[forNodeDelete];
                                // если не успешно то надо как-то возвратить все обратно
                                console.log(this.kids);
                            } else {

                                // если не удаляем, то эмитим событие и передаем dataId (родителю)
                                this.props.parentBus.emit('CLICK_GET_CHAT_ID', dataId);

                            }
                        }
                    }
                });
                
                this.kids[`fieldLi${this.iGlob}`].element.innerHTML = this.props.chatsFieldData[indexAddChat];
                this.kids[`fieldLi${this.iGlob}`].element.setAttribute('data-id', this.props.usersDataId[indexAddChat]);
                
                
                if (this.props.checkAddChat) this.namesElementsOfNavList.unshift(`fieldLi${this.iGlob}`)
                    else this.namesElementsOfNavList.push(`fieldLi${this.iGlob}`) // если init render, то в конец
            }

        }

        return this.compile(template, { 
            arrNames: this.namesElementsOfNavList
        })
    }

    
    // render() {   

    //     for (; this.iGlob < this.props.chatsFieldData.length; this.iGlob++) {

    //         if (!this.namesElementsOfNavList.includes(`fieldLi${this.iGlob}`)) { // !!!
                
    //             const indexAddChat = this.props.checkAddChat ? 0 : this.iGlob; // если создание нового чата, то 0 для добавления из начала
    //             // console.log('add chat', this.iGlob)
                
    //             this.kids[`fieldLi${this.iGlob}`] = new Block('li', {
    //                 events: {
    //                     click: (e: MouseEvent) => {
    //                         const dataId = (e.currentTarget as HTMLLIElement).getAttribute('data-id');

    //                         if ((e.target as HTMLButtonElement).classList.contains('delete-chat')
    //                             /* && confirm('Здесь должно быть окошко с вопросом:\nУдалить?') */) {

    //                             const iChat = this.props.usersDataId.indexOf(dataId);
    //                             const forNodeDelete = this.namesElementsOfNavList[iChat];
                                    
    //                             // console.log(this.props.chatsFieldData);
    //                             // console.log(this.props.usersDataId);
    //                             // console.log(this.namesElementsOfNavList);
                                    
    //                             delete this.namesElementsOfNavList[iChat]; // сначала удаляем из важного
    //                             delete this.props.chatsFieldData[iChat]; // затем данные полей
    //                             delete this.props.usersDataId[iChat]; // и наконец из dataId сопоставлений
                                
    //                             this.eventBus().emit('flow:render');
                                
    //                             this.props.parentBus.emit('CLICK_DELETE_CHAT', iChat, dataId);
                                
    //                             // запуск api удаления и если успешно то все ок удаляем до последнего
    //                             delete this.kids[forNodeDelete];
    //                             // если не успешно то надо как-то возвратить все обратно
    //                             console.log(this.kids);
    //                         } else {

    //                             // если не удаляем, то эмитим событие и передаем dataId (родителю)
    //                             this.props.parentBus.emit('CLICK_GET_CHAT_ID', dataId);

    //                         }
    //                     }
    //                 }
    //             });
                
    //             this.kids[`fieldLi${this.iGlob}`].element.innerHTML = this.props.chatsFieldData[indexAddChat];
    //             this.kids[`fieldLi${this.iGlob}`].element.setAttribute('data-id', this.props.usersDataId[indexAddChat]);
                
                
    //             if (this.props.checkAddChat) this.namesElementsOfNavList.unshift(`fieldLi${this.iGlob}`)
    //                 else this.namesElementsOfNavList.push(`fieldLi${this.iGlob}`) // если init render, то в конец
    //         }

    //     }

    //     return this.compile(template, { 
    //         arrNames: this.namesElementsOfNavList
    //     })
    // }
}
