const AuthPageParam = [
    {
        tag: 'input',
        type: 'text',
        idName: 'login',
        label: 'логин',
        required: true
    },
    {
        tag: 'input',
        type: 'password',
        idName: 'password',
        label: 'пароль',
        required: true
    },
    {
        tag: 'button',
        label: 'войти',
        type: 'submit',
        className: ['btn__main', 'fs35px']
    },
    {
        tag: 'a',
        href: '/sign-up',
        label: 'впервые?'
    }
];
export default AuthPageParam;
