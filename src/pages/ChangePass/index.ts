import template from './changePass.hbs';
import Block from '../../utils/Block';
import Form from '../../components/Form';
import ChangePassPageParam from './changePassParam';
import isEqual from '../../utils/isEqual';

interface ChangePassPageProps {
    [key: string]: string;
}
export default class ChangePassPage extends Block {
    constructor(props: ChangePassPageProps) {      
        super('main', props);    
    }
    
    init() {   
        this.kids.form = new Form({
            creator: 'ChangePassPage',
            ChangePassPageParam: ChangePassPageParam
        });
        this.element.classList.add('wrap');
    }
    
    render() {
        return this.compile(template, { /* title: this.props.title */ })
    }
}
