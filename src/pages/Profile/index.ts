import template from './profile.hbs';
import Block from '../../utils/Block';
import SectionWith from '../../components/SectionWith';
import withStore from '../../services/withStore';
import isEqual from '../../utils/isEqual';
import store from '../../services/Store';
import httpData from '../../utils/httpData';

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
                href: '/messenger',
                label: 'к чатам',
                dataApi: true,
                todo: 'chats/messenger'
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
    

    if (this.kids != undefined) {
        
        if (!isEqual(oldData, data)) {
            const arrElems = document.getElementsByClassName('profile-cont__field');
            setTimeout(() => {
                arrElems[1].children[1].textContent = data?.email;
                arrElems[2].children[1].textContent = data?.login
                arrElems[3].children[1].textContent = data?.first_name
                arrElems[4].children[1].textContent = data?.second_name
                arrElems[5].children[1].textContent = data?.display_name
                arrElems[6].children[1].textContent = data?.phone
            }, 30)
        }
        
        // здесь кешируется изображение и лишний раз не меняется если в сторе оно уже есть
        const avatar = state.avatar ?? {};
        const elemAvatar = this.kids.sectionWith.kids.avaChange0.element.parentNode;
        if (avatar.base64img/*  && data?.avatar === avatar.url */) {
            elemAvatar.style.backgroundImage = `url('${avatar.base64img}')`;
            elemAvatar.style.backgroundSize = 'cover';
        }

        if (data?.avatar) {
            if (!avatar.url || (avatar.url && avatar.url !== data?.avatar)) {
                httpData(`https://ya-praktikum.tech/api/v2/resources${data?.avatar}`, (result) => {
                    elemAvatar.style.backgroundImage = `url(${result})`;
                    elemAvatar.style.backgroundSize = 'cover';
                    store.set('avatar', {base64img: result, url: data?.avatar});
                })
            }
        }

        oldData = Object.assign({}, data);
        console.log('обновление', this.kids.sectionWith.creator);
    } else {
        //console.log('мимо', this)
    }
    return null;    
}

const ProfilePage = withStore(mapStateToProps)(ProfilePageBase);

export default ProfilePage;
