import template from './changePass.hbs';
import Block from '../../utils/Block';
import Form from '../../components/Form';
import ChangePassPageParam from './changePassParam';
import isEqual from '../../utils/isEqual';
import withStore from '../../services/withStore';
import httpData from '../../utils/httpData';
import store from '../../services/Store';

interface ChangePassPageProps {
    [key: string]: string;
}
class ChangePassPageBase extends Block {
    constructor(props: ChangePassPageProps) {      
        super('main', props);    
    }
    
    init() {   
        this.kids.form = new Form({
            creator: 'ChangePassPage',
            ChangePassPageParam: ChangePassPageParam
        });
        this.element.classList.add('wrap');
    }
    
    render() {
        return this.compile(template, { /* title: this.props.title */ })
    }
}

const mapStateToProps = function (this: any, state: Record<string, any>) {
    const data = state.user?.data;
    if (this.kids != undefined) {

        const avatar = state.avatar ?? {};
        const elemAvatar = this.kids.form.kids.avaStatic0.element.parentNode;
        if (avatar.base64img/*  && data?.avatar === avatar.url */) {
            elemAvatar.style.backgroundImage = `url('${avatar.base64img}')`;
        }

        if (data?.avatar) {
            if (!avatar.url || (avatar.url && avatar.url !== data?.avatar)) {
                httpData(`https://ya-praktikum.tech/api/v2/resources${data?.avatar}`, (result) => {
                    elemAvatar.style.backgroundImage = `url(${result})`;
                    store.set('avatar', {base64img: result, url: data?.avatar});
                })
            }
        }

        console.log('обновление', this.kids.form.creator);
    } else {
        //console.log('мимо', this)
    }
    return null;
}

const ChangePassPage = withStore(mapStateToProps)(ChangePassPageBase);

export default ChangePassPage;
