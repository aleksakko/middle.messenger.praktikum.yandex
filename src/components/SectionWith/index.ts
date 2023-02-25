import template from './sectionWith.hbs';
import Block from '../../utils/Block';
import Alink from '../Alink';
import Textarea from '../Textarea';
import Button from '../Button';
import AuthController from '../../services/controllers/AuthController';

import router, { Routes } from '../../services/router';
import ModalAvatar from '../ModalAvatar';

interface SectionWithProps {
    [key: string]: any;
}
export default class SectionWith extends Block {
    tmpl!: Record<string, Record<string, string>>;
    creator!: string;
    PageParam!: any[];
    
    constructor(props: SectionWithProps) {
        super('section', props);
    }
    
    init() {
        this.creator = this.props.creator;
        
        if (this.props.modalAvatar) this.kids.modalAva = new ModalAvatar({
            inputImg: {
                type: 'file',
                idName: 'file'
            },
            buttonSubmit: {
                label: 'изменить аватар',
                type: 'submit',
                idName: 'submitImg',
                className: ['btn__main', 'fs25px']
            }
        })

        let i = 0;
        this.tmpl = {
            labelSpanUp: {},
            labelSpanDown: {}
        };

        this.PageParam = this.props[`${this.creator}Param`] ?? undefined;
        if (this.PageParam) this.PageParam.forEach((prop: Record<string, any>) => {
            if (prop.tag === 'a') {
                this.kids[`alink${i++}`] = new Alink({
                    href: prop.href,
                    label: prop.label,
                    class: prop.class,
                    dataApi: prop.dataApi, // если есть на ссылке такой аттрибут, то обрабатываем через api
                    
                    events: {
                        click: () => {
                            
                            // api часть ссылок
                            switch (prop.todo) {
                                case 'auth/logout': {
                                    console.log('логаут');
                                    AuthController.logout();
                                    break;
                                }
                                case 'user/settings': { //----
                                    console.log('изменить личность');
                                    router.go(Routes.ChangeProfile);
                                    break;
                                }
                                case 'user/change-password': { //----
                                    console.log('изменить пароль');
                                    router.go(Routes.ChangePassword);
                                    break;
                                }
                                case 'chats/messenger': { //----
                                    console.log('к чатам');
                                    router.go(Routes.Messenger);
                                    break;
                                }
                            }
                        }
                    }
                })
            }
            if (prop.tag === 'avaChange') {
                this.kids[`avaChange${i++}`] = new Alink({
                    href: prop.href,
                    label: prop.label,
                    class: prop.class,
                    dataApi: prop.dataApi,
                    events: {
                        'click': (e: MouseEvent) => {
                            console.log(`clicked`, e.target)
                            const target = e.target as HTMLLinkElement;
                            target.classList.toggle('modal-avatar');
                            target.textContent = target.textContent ? '' : 'сменить';
                            
                            const elemModal = this.kids.modalAva.element;
                            if (elemModal) elemModal.classList.toggle('hidden-vis');
                        },
                        'blur': (e: MouseEvent) => {
                            const target = e.target as HTMLLinkElement;
                            target.textContent = 'сменить';
                        }
                    }
                })
            }
            if (prop.tag === 'span') {
                this.tmpl.labelSpanUp[`span${i}`] = prop.labelSpanUp;
                this.tmpl.labelSpanDown[`span${i}`] = prop.labelSpanDown;
                this.kids[`span${i++}`] = new Alink({})
            }
            if (prop.tag === 'textarea') {
                this.kids[`textarea${i++}`] = new Textarea({
                    idName: prop.idName,
                    placeholder: prop.placeholder,
                    events: prop.events
                })
            }
            if (prop.tag === 'button') {
                this.kids[`button${i++}`] = new Button({                    
                    label: prop.label,
                    type: prop.type,
                    idName: prop.idName,
                    className: prop.className,
                    events: prop.events
                })
            }
        });
        if(this.props.idName) this.element.setAttribute('id', this.props.idName);
        if(this.props.className) this.element.classList.add(...this.props.className);
    }
    
    render() {   
        console.log('SectionWith.render()');        
        
        return this.compile(template, { 
            title: this.props.title, 
            titletag: this.props.titletag,
            childClassName: this.props.childClassName,
            className: this.props.className,
            tmpl: this.tmpl,
            modalAvatar: this.props.modalAvatar ?? null
        })
    }
}
