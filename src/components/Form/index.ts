import validateElem from '../../utils/validate';
import tagsModel from './formModel.ts';
import Handlebars from 'handlebars';
import Block from '../../utils/Block';
import Input from '../Input';
import Button from '../Button';
import Alink from '../Alink';
import AuthController from '../../services/controllers/AuthController';
import UsersController from '../../services/controllers/UsersController';
import router, { Routes } from '../../services/router';

interface FormProps {
    [key: string]: unknown;
}

export default class Form extends Block {
    tmpl!: Record<string, Record<string, string>>;
    creator!: string;
    private template!: HandlebarsTemplateDelegate;
    
    constructor(props: FormProps) {
        super('form', props);
    }
    
    init() {
        this.creator = this.props.creator;
        
        let i = 0;
        this.tmpl = {
            labelfor: {},
            label: {}
        };
        const tmpl = this.tmpl;
        
        // массив из двух элементов для сверки пароля и повтора пароля
        let passwordCheck: string[] = ['', ''];
        // подписка на событие отправки формы submit
        // ВАЛИДАЦИЯ И ОТПРАВКА ФОРМЫ
        this.element.addEventListener(
            "submit", (e) => {
                //const target = e.target as HTMLFormElement; 
                e.preventDefault();
                const formData: Record<string, any> = {};
                passwordCheck = ['', ''];
                let checkForm = true; // если хотя бы один элемент не пройдет валидацию

                Object.keys(tmpl.labelfor).forEach((inputKey) => {
                    const key = tmpl.labelfor[inputKey],
                        elemForm = document.getElementById(key) as HTMLInputElement,
                        value = elemForm.value;
                    if (elemForm.id === 'password') passwordCheck[0] = value;
                    if (elemForm.id === 'password_repeat') passwordCheck[1] = value;
                    
                    const resValidate = validateElem(key, value, 'submit', passwordCheck)
                    if (!resValidate[0]) {                                
                        elemForm.value = '';
                        elemForm.classList.add('placeRed');
                        elemForm.placeholder = resValidate[1] as string;
                        checkForm = false;
                    }

                    formData[key] = value;
                });

                if (checkForm) {
                    console.log('Данные для отправки:', '\n', formData);
                    
                    // api часть формы
                    switch (this.creator) {
                        case 'AuthPage': {
                            AuthController.signin(formData as apiSigninData);
                            break;
                        }
                        case 'RegPage': {
                            console.log('Запускаем регистрацию - RegPage');
                            AuthController.signup(formData as apiSignupData);
                            break;
                        }
                        case 'ChangeProfilePage': {
                            console.log('Запускаем изменение профиля = ChangeProfilePage');
                            UsersController.setProf(formData as apiSignupData);
                            break;
                        }
                        case 'ChangePassPage': {
                            console.log('Запускаем изменение профиля = ChangeProfilePage');
                            UsersController.setPass(formData as apiPass);
                            break;
                        }
                    }
                } else {
                    console.log('Валидация не пройдена');
                    console.log('Данные для отправки:', '\n', formData);
                }
            }
        );

        const PageParam = this.props[`${this.creator}Param`] ? this.props[`${this.creator}Param`] : undefined;
        if (PageParam) PageParam.forEach((prop: Record<string, any>) => {
            if (prop.tag === 'input') {
                this.tmpl.labelfor[`input${i}`] = prop.idName;
                this.tmpl.label[`input${i}`] = prop.label;
                this.kids[`input${i++}`] = new Input({
                    type: prop.type,
                    idName: prop.idName,
                    value: prop.value,
                    required: prop.required,
                    events: {

                        // ПРЕВАЛИДАЦИЯ У КАЖДОГО ИНПУТА В ФОРМЕ при потере фокуса
                        'blur': (e: MouseEvent) => {
                            //console.log(`blured`, e.target);
                            const target = e.target as HTMLInputElement;
                            // passwordCheck сохраняем в замыкании самой формы
                            if (target.id === 'password') passwordCheck[0] = target.value;
                            if (target.id === 'password_repeat') passwordCheck[1] = target.value;
                            const resValidate = validateElem(target.id, target.value, 'blur', passwordCheck);
                            if (!resValidate[0]) {
                                target.value = '';
                                target.classList.add('place-red');
                                target.placeholder = resValidate[1] as string;
                            }
                        }

                    }
                })
            } else if (prop.tag === 'a') {
                this.kids[`alink${i++}`] = new Alink({
                    href: prop.href,
                    label: prop.label,
                    class: prop.class,
                    dataApi: prop.dataApi,
                    events: {
                        'click': () => {
                            switch (prop.todo) {
                                case 'user/profile': {
                                    console.log('ПЕРЕХОД: профиль');
                                    router.go(Routes.Profile);
                                    break;
                                }
                            }
                        } 
                    }
                })
            } else if (prop.tag === 'button') {
                this.kids[`button${i++}`] = new Button({
                    label: prop.label,
                    type: prop.type,
                    className: prop.className,
                    events: {
                        //click: (e: MouseEvent) => console.log(`clicked`, e.target)
                    }
                })
            } else if (prop.tag === 'avaChange') {
                this.kids[`avaChange${i++}`] = new Alink({
                    href: prop.href,
                    label: prop.label,
                    class: prop.class,
                    dataApi: prop.dataApi,
                    events: {
                        //click: (e: MouseEvent) => console.log(`clicked`, e.target)
                    }
                })
            } else if (prop.tag === 'avaStatic') {
                this.kids[`avaStatic${i++}`] = new Alink({
                    href: prop.href,
                    label: prop.label,
                    class: ['hidden'],
                    events: {
                        //click: (e: MouseEvent) => console.log(`clicked`, e.target)
                    }
                })
            }
        });
        this.element.classList.add('form-cont');

        this.template = Handlebars.compile(tagsModel);
    }
    
    render() {   
        return this.compile(this.template, { 
            title: this.props.title, 
            titletag: this.props.titletag,
            tmpl: this.tmpl          
        })
    }
}
