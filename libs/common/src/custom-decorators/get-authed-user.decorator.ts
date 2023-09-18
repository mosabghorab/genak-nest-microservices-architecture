import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// custom decorator for returning the user from the request.
export const GetAuthedUser = createParamDecorator((data: any, context: ExecutionContext) => {
  if (context.getType() === 'rpc') {
    return context.switchToRpc().getData().authedUser;
  } else if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().authedUser;
  }
});
