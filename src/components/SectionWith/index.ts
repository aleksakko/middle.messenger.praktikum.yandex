import template from './sectionWith.hbs';
import Block from '../../utils/Block';
import Alink from '../Alink';

interface FormProps {
    [key: string]: any;
}

export default class Form extends Block {
    tmpl: Record<string, Record<string, string>>;
    
    constructor(props: FormProps) {
        super('section', props);
        this.tmpl = {};
    }
    
    init() {
        let i: number = 0;
        this.tmpl = {
            labelSpanUp: {},
            labelSpanDown: {}
        };
        const creator = this.props.creator;
        const PageParam = this.props[`${creator}Param`] ? this.props[`${creator}Param`] : undefined;
        if (PageParam) PageParam.forEach((prop: Record<string, any>) => {
            if (prop.tag === 'a') {
                this.kids[`alink${i++}`] = new Alink({
                    href: prop.href,
                    label: prop.label,
                    class: prop.class,
                    events: {
                        click: (e: MouseEvent) => console.log(`clicked`, e.target)
                    }
                })
            }
            if (prop.tag === 'avaChange') {
                this.kids[`avaChange${i++}`] = new Alink({
                    href: prop.href,
                    label: prop.label,
                    class: prop.class,
                    events: {
                        click: (e: MouseEvent) => console.log(`clicked`, e.target)
                    }
                })
            }
            if (prop.tag === 'span') {
                this.tmpl.labelSpanUp[`span${i}`] = prop.labelSpanUp;
                this.tmpl.labelSpanDown[`span${i}`] = prop.labelSpanDown;
                this.kids[`span${i++}`] = new Alink({})
            }
        });
        this.element.classList.add(this.props.className);
        //console.log('init Form');
    }
    
    render() {   
        //console.log('render Form');
        return this.compile(template, { 
            title: this.props.title, 
            titletag: this.props.titletag,
            childClassName: this.props.childClassName,
            className: this.props.className,
            tmpl: this.tmpl          
        })
    }
}
