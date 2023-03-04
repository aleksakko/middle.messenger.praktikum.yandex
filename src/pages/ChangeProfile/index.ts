import template from './changeProfile.hbs';
import Block from '../../utils/Block';
import Form from '../../components/Form';
import withStore from '../../services/withStore';
import isEqual from '../../utils/isEqual';
import ChangeProfilePageParam from './changeProfileParam';
import store from '../../services/Store';
import httpData from '../../utils/httpData';

interface ChangeProfilePageProps {
    [key: string]: string;
}
class ChangeProfilePageBase extends Block {
    constructor(props: ChangeProfilePageProps) {      
        super('main', props);    
    }
    
    init() {               

        this.kids.form = new Form({
            creator: 'ChangeProfilePage',
            ChangeProfilePageParam: ChangeProfilePageParam
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
            this.kids.form.kids.input1._element.value = data?.email;
            this.kids.form.kids.input2._element.value = data?.login
            this.kids.form.kids.input3._element.value = data?.first_name
            this.kids.form.kids.input4._element.value = data?.second_name
            this.kids.form.kids.input5._element.value = data?.display_name
            this.kids.form.kids.input6._element.value = data?.phone
        }
        
        const avatar = state.avatar ?? {};
        const elemAvatar = this.kids.form.kids.avaStatic0.element.parentNode; 
        if (avatar.base64img) {
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
        // console.log('обновление', this.kids.form.creator);
    } else {
        //console.log('мимо', this)
    }
    return null;
}

const ChangeProfilePage = withStore(mapStateToProps)(ChangeProfilePageBase);

export default ChangeProfilePage;
