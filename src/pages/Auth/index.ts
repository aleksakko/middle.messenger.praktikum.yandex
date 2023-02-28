import template from './auth.hbs';
import Block from '../../utils/Block';
import Form from '../../components/Form';
import AuthPageParam from './authParam';

interface AuthPageProps {
    [key: string]: string;
}
export default class AuthPage extends Block {
    constructor(props: AuthPageProps) {

        super('main', props);
        
    }
    
    init() { 
        loggg.push(['AuthPage start init', 'Auth/index.ts 19']);
        
        //console.log('init Reg');
        this.kids.form = new Form({
            creator: 'AuthPage',
            titletag: 'h2',
            title: 'заходи',
            AuthPageParam: AuthPageParam
        });
        this.element.classList.add('wrap');

        loggg.push(['AuthPage end init', 'Auth/index.ts 29']);
    }
    
    render() {
        //console.log('render Reg');        
        return this.compile(template, { /* title: this.props.title */ })
    }
}
