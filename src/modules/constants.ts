export const constants = {
    regExp: {
        first_second_name: /^[A-ZА-ЯЁ][-a-zа-яё]*$/,
        login: /^(?=.*[a-zA-Z])[\w-]{3,20}$/,
        email: /^[\w-]+@[a-zA-Z]+\.[a-zA-Z]+$/,
        password: /^(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]{8,40}$/,
        phone: /^(\+?\d{10,15})$/,
        message: /\S+/
    }
}

export const regExp = constants.regExp;
