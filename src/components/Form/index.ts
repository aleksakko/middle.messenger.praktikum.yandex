import validateElem from '../../utils/validate';
import template from './form.hbs';
import Block from '../../utils/Block';
import Input from '../Input';
import Button from '../Button';
import Alink from '../Alink';

interface FormProps {
    [key: string]: any;
}

export default class Form extends Block {
    tmpl: Record<string, Record<string, string>>;
    
    constructor(props: FormProps) {
        super('form', props);
        this.tmpl = {};
    }
    
    init() {
        let passwordCheck: string[] = ['', ''];

        //console.log('init Form');
        let i: number = 0;
        this.tmpl = {
            labelfor: {},
            label: {}
        };
        let tmpl = this.tmpl;
        const creator = this.props.creator;
        const PageParam = this.props[`${creator}Param`] ? this.props[`${creator}Param`] : undefined;
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
                        blur: (e: MouseEvent) => {
                            //console.log(`blured`, e.target);
                            const target = e.target as HTMLInputElement;
                            // passwordCheck сохраняем в замыкании самой формы
                            if (target.id === 'password') passwordCheck[0] = target.value;
                            if (target.id === 'password_repeat') passwordCheck[1] = target.value;
                            const resValidate = validateElem(target.id, target.value, 'blur', passwordCheck);
                            if (!resValidate[0]) {                                
                                target.value = '';
                                target.classList.add('placeRed');
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
                    events: {
                        //click: (e: MouseEvent) => console.log(`clicked`, e.target)
                    }
                })
            } else if (prop.tag === 'button') {
                this.kids[`button${i++}`] = new Button({
                    label: prop.label,
                    type: prop.type,
                    class: prop.class,
                    events: {

                        // ВАЛИДАЦИЯ И ОТПРАВКА ФОРМЫ (на данный момент выводится в консоль)
                        click: (e: MouseEvent) => {
                            const target = e.target as HTMLButtonElement;
                            if (target.type === 'submit') {
                                e.preventDefault();
                                const formData: Record<string, string> = {};
                                passwordCheck = ['', ''];
                                let checkForm = true; // если хотя бы один элемент не пройдет валидацию

                                Object.keys(tmpl.labelfor).forEach((inputKey) => {
                                    let key = tmpl.labelfor[inputKey],
                                        elemForm = document.getElementById(key) as HTMLInputElement,
                                        value = elemForm.value;
                                    if (elemForm.id === 'password') passwordCheck[0] = target.value;
                                    if (elemForm.id === 'password_repeat') passwordCheck[1] = target.value;
                                    
                                    const resValidate = validateElem(key, value, 'submit', passwordCheck)
                                    if (!resValidate[0]) {                                
                                        elemForm.value = '';
                                        elemForm.classList.add('placeRed');
                                        elemForm.placeholder = resValidate[1] as string;
                                        checkForm = false;
                                    }

                                    formData[key] = value;
                                });

                                if (checkForm) console.log('Данные для отправки:', '\n', formData);
                            }
                        }

                    }
                })
            } else if (prop.tag === 'avaChange') {
                this.kids[`avaChange${i++}`] = new Alink({
                    href: prop.href,
                    label: prop.label,
                    class: prop.class,
                    events: {
                        //click: (e: MouseEvent) => console.log(`clicked`, e.target)
                    }
                })
            } else if (prop.tag === 'avaStatic') {
                this.kids[`avaStatic${i++}`] = new Alink({
                    href: prop.href,
                    label: prop.label,
                    class: prop.class,
                    events: {
                        // click: (e: MouseEvent) => {
                        //     console.log(`clicked`, e.target);
                        // }
                    }
                })
            }
        });
        this.element.classList.add('form-cont');
        //console.log('end init Form');
    }
    
    render() {   
        //console.log('start render Form');
        return this.compile(template, { 
            title: this.props.title, 
            titletag: this.props.titletag,
            tmpl: this.tmpl          
        })
    }
}
