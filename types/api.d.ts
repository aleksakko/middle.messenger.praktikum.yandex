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

interface apiChatUser extends apiUser {
  role: string;
}
interface apiPass {
    oldPassword: string;
    newPassword: string;
}
interface apiLogin {
    login: string;
}
interface apiChats {
    id: number,
    title: string,
    avatar: string | null,
    created_by: number
    unread_count: number,
    last_message: {
    user: {
        first_name: string,
        second_name: string,
        avatar: string,
        email: string,
        login: string,
        phone: string
      },
      time: string,
      content: string
    } | null
  }[]

interface apiReqQueryChats {
    offset?: number;
    numbers?: number;
    title?: string;
}
interface apiReqQueryChatUser {
    offset?: number;
    limit?: number;
    name?: string;
    email?: string;
}
interface apiResCreateChat {
    id: number;
    title: string;
}
interface apiDelChats {
    userId: number;
    result: {
        id: number;
        title: string;
        avatar: string | null;
    };
}

interface apiReqUsersChat {
    users: [
      number
    ],
    chatId: number
  }

interface apiDataWebSocket {
  id: number;
  time: string;
  type: string;
  user_id: string;
  content: string;
  file?: {
      id: number;
      user_id: number;
      path: string;
      filename: string;
      content_type: string;
      content_size: number;
      upload_date: string
  }           
}
