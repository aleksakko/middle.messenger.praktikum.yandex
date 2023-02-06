import Block from '../../utils/Block';
//import template from './alink.hbs';

type AlinkProps = Record<string, any>

export default class Alink extends Block {
    constructor(props: AlinkProps) {
        super('a', props);
        
        this.element.setAttribute('href', this.props.href);
        this.element.textContent = this.props.label;
        //this.element.classList.add(); // здесь можно добавлять классы для кнопки.. удобно по Бэму
    }

    // render() {
    //     //return this.compile(template, { label: this.props.label });
    // }
}
