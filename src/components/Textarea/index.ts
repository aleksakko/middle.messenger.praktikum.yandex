import Block from '../../utils/Block';
//import template from './textarea.hbs';

type TextareaProps = Record<string, any>

export default class Textarea extends Block {
    constructor(props: TextareaProps) {
        super('textarea', props);
        
        if (this.element instanceof HTMLTextAreaElement) {
            if (this.props.idName) {
                this.element.setAttribute('id', this.props.idName);
                this.element.setAttribute('name', this.props.idName);
            }
            if (this.props.placeholder) this.element.setAttribute('placeholder', this.props.placeholder);
            if (this.props.value) this.element.value = this.props.value;
            // в инстансе Инпута в props.class можно добавить [] с классами для кнопки
            // классы через пропсы.. удобно по Бэму
            if (this.props.class) this.element.classList.add(...this.props.class);
        }
    }

    // render() {
    //     return this.compile(template, { example: this.props.example });
    // }
}
