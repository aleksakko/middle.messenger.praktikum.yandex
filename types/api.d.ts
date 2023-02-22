interface apiSignupData {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    password: string;
    phone: string;
}

interface apiSigninData {
    login: string;
    password: string;
}

interface apiUser {
    id: number;
    first_name: string;
    second_name: string;
    display_name: string;
    login: string;
    email: string;
    phone: string;
    avatar: string;
  }

interface apiPass {
    oldPassword: string;
    newPassword: string;
}

interface apiLogin {
    login: string;
}
