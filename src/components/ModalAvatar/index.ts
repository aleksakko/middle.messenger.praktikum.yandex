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
                e.preventDefault();

                const fileInput = document.getElementById(this.props.inputImg.idName) as HTMLInputElement;
                const formData = new FormData();

                if (fileInput.files) {
                    formData.append('avatar', fileInput.files[0])

                    const elemAvatar = document.querySelector('.avatar') as HTMLDivElement
                    const reader = new FileReader();
                    reader.onload = () => {               
                        if (elemAvatar) elemAvatar.style.backgroundImage = `url('${reader.result}')`;

                        UsersController.setAvatar(formData, reader.result);
                    }
                    reader.readAsDataURL(fileInput.files[0]);
                }
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

        this.element.classList.add('modal', 'modal-avatar', 'hidden-vis');
        this.element.setAttribute('enctype', 'multipart/form-data');
    }
    
    render() {
        return this.compile(template, {   })
    }
}
