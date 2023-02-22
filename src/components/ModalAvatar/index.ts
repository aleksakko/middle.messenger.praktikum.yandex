import template from './modalAvatar.hbs';
import Block from '../../utils/Block';
import Input from '../Input';
import Button from '../Button';
import UsersController from '../../services/controllers/UsersController';

interface ModalAvatarProps {
    [key: string]: any;
}

export default class ModalAvatar extends Block {
    
    constructor(props: ModalAvatarProps) {
        super('form', props);
    }
    
    init() {

        this.element.addEventListener(
            "submit", (e) => {
                //const target = e.target as HTMLFormElement;
                e.preventDefault();

                const fileInput = document.getElementById(this.props.inputImg.idName);
                const formData = new FormData(this.element);

                formData.append('avatar', fileInput.files[0], fileInput.files[0].name)

                const elemAvatar = document.querySelector('.avatar')
                const reader = new FileReader();
                // reader.onload = (e) => {
                //     elemAvatar.style.backgroundImage = `url('${e.target.result}')`;
                // }
                // reader.readAsDataURL(fileInput.files[0]);
                console.log(formData.get('avatar'));
                //setTimeout(()=> elemAvatar.style.removeProperty('background'), 1000)
                
                setTimeout(() => UsersController.setAvatar(formData), 3000);
            }
        )
        
        this.kids.inputImg = new Input({
            type: this.props.inputImg.type,
            idName: this.props.inputImg.idName,
            accept: "image/*"
        })

        this.kids.buttonSubmit = new Button({
            label: this.props.buttonSubmit.label,
            type: this.props.buttonSubmit.type,
            idName: this.props.buttonSubmit.idName,
            className: this.props.buttonSubmit.className
        })

        this.element.classList.add('modal', 'hidden-vis');
        this.element.setAttribute('enctype', 'multipart/form-data');
    }
    
    render() {
        return this.compile(template, {   })
    }
}
