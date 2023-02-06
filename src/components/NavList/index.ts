import template from './navList.hbs';
import Block from '../../utils/Block';

interface NavListProps {
    [key: string]: any;
}

export default class NavList extends Block {
    
    constructor(props: NavListProps) {
        super('nav', props);
    }
    
    init() {
        // console.log('init Nav');
        for (let i = 0; i < this.props.chatsFieldData.length; i++) {

            this.kids[`fieldLi${i}`] = new Block('li', {
                events: {
                    click: (e: MouseEvent) => {
                        const dataId = (e.currentTarget as HTMLElement).getAttribute('data-id');
                        this.props.parentBus.emit('clickAndGetChatId', dataId);
                    }
                }
            });
            this.kids[`fieldLi${i}`].element.innerHTML = this.props.chatsFieldData[i];
            this.kids[`fieldLi${i}`].element.setAttribute('data-id', this.props.usersDataId[i]);

        }
        this.element.classList.add(this.props.classNav);
        
        // console.log('end init NavList');        
    }
    
    render() {   
        // console.log('start render NavList');
        return this.compile(template, {
            //tmpl: this.tmpl
        })
    }
}
