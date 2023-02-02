const ChangeProfilePageParam = [
    {
        tag: 'avaChange',
        href: '/',
        label: 'сменить'
    },
    {
        tag: 'input',
        type: 'email',
        idName: 'email',
        label: 'почта',
        value: 'nepetya@ya.ru'
    },
    {
        tag: 'input',
        type: 'text',
        idName: 'login',
        label: 'логин',
        value: 'petefi'
    },
    {
        tag: 'input',
        type: 'text',
        idName: 'first_name',
        label: 'имя',
        value: 'Петя'
    },
    {
        tag: 'input',
        type: 'text',
        idName: 'second_name',
        label: 'фамилия',
        value: 'Петин' 
    },
    {
        tag: 'input',
        type: 'text',
        idName: 'display_name',
        label: 'псевдоним', 
        value: 'nepetya'
    },
    {
        tag: 'input',
        type: 'tel',
        idName: 'phone',
        label: 'телефон',
        value: '+8880076723'
    },
    {
        tag: 'button',
        label: 'изменить личность',
        type: 'submit',
        class: ['btn__main', 'fs25px']
    },
    {
        tag: 'a',
        href: '/profile',
        label: 'назад к профилю'
    }
];
export default ChangeProfilePageParam;
