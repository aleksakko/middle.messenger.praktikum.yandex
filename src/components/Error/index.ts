import template from './error.hbs';
import Block from '../../utils/Block';
import Alink from '../Alink';

interface ErrorProps {
    [key: string]: string | number;
}

export default class Error extends Block {
    
    constructor(props: ErrorProps) {
        super('main', props);
    }
    
    init() {
        this.kids.alink = new Alink({
            href: this.props.href,
            label: this.props.label
            // events: {
            //     click: (e: MouseEvent) => console.log(`clicked`, e.target)
            // }
        })        
        this.element.classList.add('wrap');
    }
    
    render() {   
        return this.compile(template, { 
            title: this.props.numberError, 
            titletag: this.props.message
        })
    }
}
