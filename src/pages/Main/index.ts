import template from './main.hbs';
import Block from '../../utils/Block';
import Alink from '../../components/Alink';

interface MainPageProps {
    [key: string]: string;
}
export default class MainPage extends Block {
    constructor(props: MainPageProps) {
        super('main', props);        
    }

    init() {       
        let i: number = 0;
        alinkInfo.forEach((prop: Record<string, string>) => {
            this.kids[`alink${i++}`] = new Alink({
                href: prop.href,
                label: prop.label,
                events: {
                    click: (e: MouseEvent) => console.log(`clicked`, e.target)
                }
            })
        });
        this.element.classList.add('wrap');
    }

    // сюда передадутся пропсы, передаваемые при создании инстанса new MainPage({title: 'Главная'})
    render() {        
        return this.compile(template, { /* title: this.props.title */ })
    }
}

const alinkInfo = [
    {
        href: '/authorization',
        label: 'авторизация' 
    },
    {
        href: '/registration',
        label: 'регистрация'
    },
    {
        href: '/list-of-chats',
        label: 'чаты'
    },
    {
        href: '/profile',
        label: 'профиль'
    },
    {
        href: '/change-profile',
        label: 'смена профиля'
    },
    {
        href: '/change-password',
        label: 'смена пароля'
    },
    {
        href: '/error-500',
        label: 'ошибка 500'
    },
    {
        href: '/error-404',
        label: 'ошибка 404'
    }
]
