import Block from '../../utils/Block';
//import template from './alink.hbs';

type ButtonProps = Record<string, any>

export default class Button extends Block {
    constructor(props: ButtonProps) {
        super('button', props);
        
        if (this.props.type) this.element.setAttribute('type', this.props.type);
        this.element.textContent = this.props.label;
        // здесь добавляются классы для кнопки.. удобно по Бэму
        if (this.props.class) this.element.classList.add(...this.props.class); 
    }

    // render() {
    //     return this.compile(template, { example: this.props.example });
    // }
}

