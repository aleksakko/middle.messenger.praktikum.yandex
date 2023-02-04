import Block from '../../utils/Block';
//import template from './alink.hbs';

type ButtonProps = Record<string, any>

export default class Button extends Block {
    constructor(props: ButtonProps) {
        super('button', props);
        
        if (this.props.type) this.element.setAttribute('type', this.props.type);
        if (this.props.label) this.element.textContent = this.props.label;
        if (this.props.idName) this.element.setAttribute('name', this.props.idName);
        // здесь добавляются классы для кнопки.. удобно по Бэму..посылать как string[]
        if (this.props.className) this.element.classList.add(...this.props.className); 
    }

    // render() {
    //     return this.compile(template, { example: this.props.example });
    // }
}

