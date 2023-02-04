const RegPageParam = [
    {
        tag: 'input',
        type: 'email',
        idName: 'email',
        label: 'почта*',
        required: true
    },
    {
        tag: 'input',
        type: 'text',
        idName: 'login',
        label: 'логин*',
        required: true
    },
    {
        tag: 'input',
        type: 'text',
        idName: 'first_name',
        label: 'имя*',
        required: true
    },
    {
        tag: 'input',
        type: 'text',
        idName: 'second_name',
        label: 'фамилия' 
    },
    {
        tag: 'input',
        type: 'tel',
        idName: 'phone',
        label: 'телефон' 
    },
    {
        tag: 'input',
        type: 'password',
        idName: 'password',
        label: 'пароль*',
        required: true
    },
    {
        tag: 'input',
        type: 'password',
        idName: 'password_repeat',
        label: 'повтор пароля*',
        required: true
    },
    {
        tag: 'button',
        label: 'создать',
        type: 'submit',
        className: ['btn__main', 'fs35px']
    },
    {
        tag: 'a',
        href: '/authorization',
        label: 'войти'
    }
];
export default RegPageParam;
