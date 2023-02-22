import template from './profile.hbs';
import Block from '../../utils/Block';
import SectionWith from '../../components/SectionWith';
import withStore from '../../services/withStore';
import isEqual from '../../utils/isEqual';

interface ProfilePageProps {
    [key: string]: string;
}
class ProfilePageBase extends Block {
    constructor(props: ProfilePageProps) {      
        super('main', props);    
    }
    
    init() {
        const ProfilePageParam = [
            {
                tag: 'avaChange',
                href: '/',
                label: 'сменить',
                dataApi: true
            },
            {
                tag: 'span',
                labelSpanUp: 'почта',
                labelSpanDown: this.props.email
            },
            {
                tag: 'span',
                labelSpanUp: 'логин',
                labelSpanDown: this.props.login
            },
            {
                tag: 'span',
                labelSpanUp: 'имя',
                labelSpanDown: this.props.first_name
            },
            {
                tag: 'span',
                labelSpanUp: 'фамилия',
                labelSpanDown: this.props.second_name
            },
            {
                tag: 'span',
                labelSpanUp: 'псевдоним',
                labelSpanDown: this.props.display_name
            },
            {
                tag: 'span',
                labelSpanUp: 'телефон',
                labelSpanDown: this.props.phone
            },
            {
                tag: 'a',
                href: '/settings',
                label: 'изменить личность',
                dataApi: true,
                todo: 'user/settings'
            },
            {
                tag: 'a',
                href: '/change-password',
                label: 'изменить пароль',
                dataApi: true,
                todo: 'user/change-password'
            },
            {
                tag: 'a',
                href: '/',
                label: 'выйти',
                dataApi: true,
                todo: 'auth/logout'
            }
        ];
        
        this.kids.sectionWith = new SectionWith({
            creator: 'ProfilePage',
            className: ['profile-cont'],
            childClassName: 'profile-cont__field',
            ProfilePageParam: ProfilePageParam,
            modalAvatar: true // указывает, что нужно модальное окно установки аватара
        });
        this.element.classList.add('wrap');
    }
    
    render() {
        return this.compile(template, { /* title: this.props.title */ })
    }
}



let oldData: Record<string, any>;

const mapStateToProps = function (this: any, state: Record<string, any>) {
    const data = state.user?.data;
    if (this.kids != undefined && !isEqual(oldData, data)) {

        this.kids.sectionWith.tmpl.labelSpanDown.span1 = data?.email;
        this.kids.sectionWith.tmpl.labelSpanDown.span2 = data?.login
        this.kids.sectionWith.tmpl.labelSpanDown.span3 = data?.first_name
        this.kids.sectionWith.tmpl.labelSpanDown.span4 = data?.second_name
        this.kids.sectionWith.tmpl.labelSpanDown.span5 = data?.display_name
        this.kids.sectionWith.tmpl.labelSpanDown.span6 = data?.phone
        this.kids.sectionWith._render();

        oldData = Object.assign({}, data);
        console.log('обновление', this.kids.sectionWith.creator);
    } else {
        //console.log('мимо', this)
    }
    return null;    
}

const ProfilePage = withStore(mapStateToProps)(ProfilePageBase);

export default ProfilePage;
