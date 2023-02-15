interface LoginFormModel {
    email: string;
    password: string;
  }

  const loginApi = new LoginAPI();
  const userLoginValidator = validateLoginFields(validateRules);

  class UserLoginController {
    public async login(data: LoginFormModel) {
        try {
            // запускаем крутилку

            const validateData = userLoginValidator(data);

            if (!validateData.isCorrect) {
                throw new Error(validateData);
            }

            const userID = loginApi.requiest(prepareDataToRequest(data));

            RouteManagement.go('/chats');

            // останавливаем крутилку
        } catch (error) {
            // логика обработки ошибок
        }
    }
  }
