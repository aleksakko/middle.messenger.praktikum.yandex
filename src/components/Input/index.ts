import Block from '../../utils/Block';
//import template from './input.hbs';

type InputProps = Record<string, any>

export default class Input extends Block {
    constructor(props: InputProps) {
        super('input', props);
        
        if (this.element instanceof HTMLInputElement) {
            this.element.setAttribute('type', this.props.type);
            this.element.setAttribute('id', this.props.idName);
            this.element.setAttribute('name', this.props.idName);
            if (this.props.value) this.element.value = this.props.value;
            if (this.props.required) {this.element.setAttribute('required', '');}
            // в инстансе Инпута в props.class можно добавить [] с классами для кнопки
            // здесь можно добавлять классы для инпута.. удобно по Бэму
            if (this.props.class) this.element.classList.add(...this.props.class);
        }
    }

    // render() {
    //     return this.compile(template, { example: this.props.example });
    // }
}
