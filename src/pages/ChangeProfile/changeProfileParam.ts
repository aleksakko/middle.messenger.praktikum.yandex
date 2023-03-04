const ChangeProfilePageParam = [
    {
        tag: 'avaStatic',
        href: '/'
    },
    {
        tag: 'input',
        type: 'email',
        idName: 'email',
        label: 'почта',
        value: ''
    },
    {
        tag: 'input',
        type: 'text',
        idName: 'login',
        label: 'логин',
        value: ''
    },
    {
        tag: 'input',
        type: 'text',
        idName: 'first_name',
        label: 'имя',
        value: ''
    },
    {
        tag: 'input',
        type: 'text',
        idName: 'second_name',
        label: 'фамилия',
        value: ''
    },
    {
        tag: 'input',
        type: 'text',
        idName: 'display_name',
        label: 'псевдоним', 
        value: ''
    },
    {
        tag: 'input',
        type: 'tel',
        idName: 'phone',
        label: 'телефон',
        value: ''
    },
    {
        tag: 'button',
        label: 'изменить личность',
        type: 'submit',
        className: ['btn__main', 'fs25px']
    },
    {
        tag: 'a',
        href: '/profile',
        label: 'назад к профилю',
        dataApi: true,
        todo: 'user/profile'
    }
];

export default ChangeProfilePageParam;
