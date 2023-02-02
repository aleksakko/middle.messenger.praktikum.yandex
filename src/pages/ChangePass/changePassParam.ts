const ChangePassPageParam = [
    {
        tag: 'avaStatic',
        href: '/',
        label: ''
    },    
    {
        tag: 'input',
        type: 'password',
        idName: 'oldPassword',
        label: 'старый пароль',
        required: true
    },
    {
        tag: 'input',
        type: 'password',
        idName: 'newPassword',
        label: 'новый пароль', 
        required: true
    },
    {
        tag: 'input',
        type: 'password',
        idName: 'newPassword_repeat',
        label: 'повтор пароля',
        required: true
    },
    {
        tag: 'button',
        label: 'изменить пароль',
        type: 'submit',
        class: ['btn__main', 'fs25px']
    },    
    {
        tag: 'a',
        href: '/profile',
        label: 'назад к профилю'
    }
];
export default ChangePassPageParam;
