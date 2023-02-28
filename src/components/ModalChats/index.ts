import template from './modalChats.hbs';
import Block from '../../utils/Block';
import Input from '../Input';
import UsersController from '../../services/controllers/UsersController';
import { ChatsPageBase } from '../../pages/Chats';
import store from '../../services/Store';

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
            placeholder: 'найти по логину',
            events: {
                'keyup': (e: KeyboardEvent) => {
                    if (e.key) {
                        const target = e.target as HTMLInputElement;
                        console.log(target.value)
                        UsersController.searchUsers(target.value)
                            .then(res => {
                                
                                const elemTarget = document.getElementById('modal-chats__results');  
                                
                                if (res?.length !== 0 && elemTarget) {                                    
                                    
                                    elemTarget.innerHTML = '<br/>';
                                    
                                    res?.forEach((user) => {
                                        const wrap = document.createElement('div');
                                        wrap.dataset.id = user.id.toString();
                                        wrap.classList.add('modal-chats__results__one');

                                        const templateStr = 
                                        `<button>+</button>
                                        <span>${user.login}\n</span>
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
        
        this.props.chatsBus.on(ChatsPageBase.TODO.CLICK_ADD_USER, (idChat: number) => {
            
            this.kids.inputSearch.element.classList.remove('hidden')

            
            console.log(idChat)
        });
        this.props.chatsBus.on(ChatsPageBase.TODO.CLICK_DELETE_USER, (idChat: number) => {
            this.kids.inputSearch.element.classList.add('hidden')
            const elemTarget = document.getElementById('modal-chats__results');
            
            console.log(store.getState())
            
            if (elemTarget) {
                console.log();
            }
            console.log(idChat)
        });
        // this.kids.inputImg = new Input({
        //     type: this.props.inputImg.type,
        //     idName: this.props.inputImg.idName,
        //     accept: "image/*"
        // })

        // this.kids.buttonSubmit = new Button({
        //     label: this.props.buttonSubmit.label,
        //     type: this.props.buttonSubmit.type,
        //     idName: this.props.buttonSubmit.idName,
        //     className: this.props.buttonSubmit.className
        // })

        this.element.classList.add('wrap-modal', 'hidden-vis');
    }
    
    render() {
        return this.compile(template, {   })
    }
}
