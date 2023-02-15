interface LoginFormModel {
    email: string;
    password: string;
  }

  import { validate, handleError } from './decorators';
  
  const userLoginValidateRules = ...;
  const handler = ...;
  
  class UserLoginController {
    @validate(userLoginValidateRules)
    @handleError(handler)
    public async login(data: LoginFormModel) {
      const userID = loginApi.request(prepareDataToRequest(data));
      RouteManagement.go('/chats');
    }
  }
