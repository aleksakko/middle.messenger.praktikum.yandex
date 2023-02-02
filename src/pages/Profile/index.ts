import template from './profile.hbs';
import Block from '../../utils/Block';
import SectionWith from '../../components/SectionWith';
import ProfilePageParam from './profileParam';

interface ProfilePageProps {
    [key: string]: string;
}
export default class ProfilePage extends Block {
    constructor(props: ProfilePageProps) {      
        super('main', props);    
    }
    
    init() {   
        this.kids.sectionWith = new SectionWith({
            creator: 'ProfilePage',
            className: 'profile-cont',
            childClassName: 'profile-cont__field',
            ProfilePageParam: ProfilePageParam
        });
        this.element.classList.add('wrap');
    }
    
    render() {
        return this.compile(template, { /* title: this.props.title */ })
    }
}
