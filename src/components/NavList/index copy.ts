import template from './navList.hbs';
import Block from '../../utils/Block';

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
        // console.log('init Nav');
        this.iGlob = 0;
        this.namesElementsOfNavList = []; // init важного массива, содержащий в нужном порядке названия элементов-чатов из this.kids
        
        this.element.classList.add(this.props.classNav);
        // console.log('end init NavList');        
    }
    
    render() {   
        // console.log('start render NavList');

        for (let i = iGlob; i < this.props.chatsFieldData.length; i++) {

            if (!this.namesElementsOfNavList.includes(`fieldLi${i}`)) { // !!!
                
                const indexAddChat = this.props.checkAddChat ? 0 : i; // если создание нового чата, то 0 для добавления из начала
                console.log('add cgat', i)
                // console.log('заходим fieldLi ', i)
                // console.log('template', this.props.chatsFieldData[indexAddChat])
                // console.log('data-id', this.props.usersDataId[indexAddChat])
                
                this.kids[`fieldLi${i}`] = new Block('li', {
                    events: {
                        click: (e: MouseEvent) => {
                            const dataId = (e.currentTarget as HTMLLIElement).getAttribute('data-id');

                            if ((e.target as HTMLButtonElement).classList.contains('delete-chat')
                                && confirm('Здесь должно быть окошко с вопросом:\nУдалить?')) {

                                console.log(this.props.chatsFieldData);
                                console.log(this.props.usersDataId);
                                console.log(this.namesElementsOfNavList);
                                
                                const iChat = this.props.usersDataId.indexOf(dataId);
                                
                                this.namesElementsOfNavList.splice(iChat, 1); // сначала удаляем из важного
                                this.props.chatsFieldData.splice(iChat, 1); // затем данные полей
                                this.props.usersDataId.splice(iChat, 1) // и наконец из dataId сопоставлений

                                this.eventBus().emit('flow:render');
                                
                                this.props.parentBus.emit('CLICK_DELETE_CHAT', iChat, dataId);

                                // запуск api удаления и если успешно то все ок удаляем до последнего
                                // если не успешно то надо как-то возвратить все обратно
                            } else {

                                // если не удаляем, то эмитим событие и передаем dataId (родителю)
                                this.props.parentBus.emit('CLICK_GET_CHAT_ID', dataId);

                            }
                        }
                    }
                });
                
                this.kids[`fieldLi${i}`].element.innerHTML = this.props.chatsFieldData[indexAddChat];
                this.kids[`fieldLi${i}`].element.setAttribute('data-id', this.props.usersDataId[indexAddChat]);
                
                
                if (this.props.checkAddChat) this.namesElementsOfNavList.unshift(`fieldLi${i}`)
                    else this.namesElementsOfNavList.push(`fieldLi${i}`) // если init render, то в конец
            }

        }

        return this.compile(template, { 
            arrNames: this.namesElementsOfNavList
        })
    }
}
