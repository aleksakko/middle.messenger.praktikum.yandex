import template from './changeProfile.hbs';
import Block from '../../utils/Block';
import Form from '../../components/Form';
import ChangeProfilePageParam from './changeProfileParam';

interface ChangeProfilePageProps {
    [key: string]: string;
}
export default class ChangeProfilePage extends Block {
    constructor(props: ChangeProfilePageProps) {      
        super('main', props);    
    }
    
    init() {   
        this.kids.form = new Form({
            creator: 'ChangeProfilePage',
            ChangeProfilePageParam: ChangeProfilePageParam
        });
        this.element.classList.add('wrap');
    }
    
    render() {
        return this.compile(template, { /* title: this.props.title */ })
    }
}
