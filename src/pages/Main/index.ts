import Handlebars from 'handlebars';
import Block from '../../utils/Block';
import Alink from '../../components/Alink';

interface MainPageProps {
    [key: string]: string;
}
export default class MainPage extends Block {
    private template!: HandlebarsTemplateDelegate;
    
    constructor(props: MainPageProps) {
        super('main', props);        
    }

    init() {       
        let i = 0;
        alinkInfo.forEach((prop: Record<string, string>) => {
            this.kids[`alink${i++}`] = new Alink({
                href: prop.href,
                label: prop.label,
                events: {
                    //click: (e: MouseEvent) => console.log(`clicked`, e.target)
                }
            })
        });
        this.element.classList.add('wrap');

        
          
        const tagsModel = `
        <nav class="wrap__main-page"><ul>
        {{#with this}}
          {{#each this}}   
            {{#if (startsWith @key "alink")}}
              <li>{{{this}}}</li>
            {{/if}}   
          {{/each}}
        {{/with}}
        </ul></nav>
          `;
          
        this.template = Handlebars.compile(tagsModel);
    }

    render() {      
        return this.compile(this.template, { /* title: this.props.title */ })
    }
}

const alinkInfo = [
    {
        href: '/',
        label: 'авторизация' 
    },
    {
        href: '/sign-up',
        label: 'регистрация'
    },
    {
        href: '/messenger',
        label: 'чаты'
    },
    {
        href: '/profile',
        label: 'профиль'
    },
    {
        href: '/settings',
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
