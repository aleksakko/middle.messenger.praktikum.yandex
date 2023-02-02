import template from './reg.hbs';
import Block from '../../utils/Block';
import Form from '../../components/Form';
import RegPageParam from './regParam';

interface RegPageProps {
    [key: string]: string;
}
export default class RegPage extends Block {
    constructor(props: RegPageProps) {      
        super('main', props);    
    }
    
    init() {   
        this.kids.form = new Form({
            creator: 'RegPage',
            titletag: 'h3',
            title: 'создание личности',
            RegPageParam: RegPageParam
        });
        this.element.classList.add('wrap');
    }
    
    render() {
        return this.compile(template, { /* title: this.props.title */ })
    }
}
