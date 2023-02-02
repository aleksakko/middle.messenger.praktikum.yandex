import template from './auth.hbs';
import Block from '../../utils/Block';
import Form from '../../components/Form';
import AuthPageParam from './authParam';

interface AuthPageProps {
    [key: string]: string;
}
export default class AuthPage extends Block {
    constructor(props: AuthPageProps) {
        //console.log('constructor Reg перед super');       
        super('main', props);
        //console.log('constructor Reg после super');       
    }
    
    init() {   
        //console.log('init Reg');
        this.kids.form = new Form({
            creator: 'AuthPage',
            titletag: 'h2',
            title: 'заходи',
            AuthPageParam: AuthPageParam
        });
        this.element.classList.add('wrap');
    }
    
    render() {
        //console.log('render Reg');        
        return this.compile(template, { /* title: this.props.title */ })
    }
}
