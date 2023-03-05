import template from './modalChats.hbs';
import Block from '../../utils/Block';
import Input from '../Input';
import UsersController from '../../services/controllers/UsersController';
import { ChatsPageBase } from '../../pages/Chats';
import store from '../../services/Store';
import ChatsController from '../../services/controllers/ChatsController';

interface ModalChatsProps {
    [key: string]: any;
}

export default class ModalChats extends Block {
    
    constructor(props: ModalChatsProps) {
        super('div', props);
    }
    
    init() {
        
        this.kids.inputSearch = new Input({
            type: 'search',
            idName: 'modal__search-input',
            placeholder: 'Поиск чатников',
            autocomplete: 'off',
            events: {
                'keyup': (e: KeyboardEvent) => {
                    if (e.key) {
                        const target = e.target as HTMLInputElement;
                        //console.log(target.value)
                        const elemTarget = document.getElementById('modal-chats__results');

                        UsersController.searchUsers(target.value)
                        .then(res => {
                       
                            if (res?.length !== 0 && elemTarget) {                                    
                                
                                    elemTarget.innerHTML = '<br/>';
                                
                                    res?.forEach((user) => {
                                        const wrap = document.createElement('div');
                                        wrap.dataset.id = user.id.toString();
                                        wrap.classList.add('modal-chats__results__add');

                                        const templateStr = 
                                        `<button>+</button>
                                        <span>${user.login}</span>
                                        <span> ${user.email}</span>`

                                        wrap.innerHTML = templateStr;

                                        elemTarget.append(wrap);
                                        elemTarget.innerHTML += '<br/>'
                                        }
                                    );
                                } else if (elemTarget) {
                                    elemTarget.innerHTML = '<br>0 results';
                                }

                            });
                    }
                }
                
            }
        })
        
        this.props.chatsBus.on(ChatsPageBase.TODO.CLICK_ADD_USER, (/* idChat: number */) => {
            
            const elemTarget = document.getElementById('modal-chats__results');
            if (elemTarget) {
                elemTarget.innerHTML = '';
                (elemTarget.previousElementSibling as HTMLElement).textContent = '';
            }
            
        });

        // подгрузка необходимых данных в модальном окне для манипуляций при клике на DELETE-USER
        this.props.chatsBus.on(ChatsPageBase.TODO.CLICK_DELETE_USER, (idChat: number) => {
            
            const elemTarget = document.getElementById('modal-chats__results');
            if (elemTarget) {
                elemTarget.innerHTML = 'ЧАТНИКИ ЭТОЙ КОМНАТЫ:<br/><br/>';
                (elemTarget.previousElementSibling as HTMLElement).textContent = '';
            }
         
            ChatsController.getUsers(idChat)
                .then(users => {
                    
                    if (users?.length !== 1 && elemTarget) {
                        
                        const thisUser = store.getState().user.data;

                        users?.forEach(user => {

                            if (user.display_name === thisUser.display_name) return;

                            const wrap = document.createElement('div');
                            wrap.dataset.id = user.id.toString();
                            wrap.classList.add('modal-chats__results__delete')
                            
                            const templateStr =
                            `<button>del</button>
                            <span>${user.display_name}</span>`

                            wrap.innerHTML = templateStr;

                            elemTarget.append(wrap);
                        })
                    } else if (elemTarget) {
                        elemTarget.innerHTML += 'ты здесь один'
                    }
                })
        });

        this.element.classList.add('wrap-modal', 'hidden-vis');
    }
    
    render() {
        return this.compile(template/* , {a:this.props.b} */)
    }
}
