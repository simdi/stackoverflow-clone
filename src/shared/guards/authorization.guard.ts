import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { UserService, USER_TYPE } from "../../services/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (user) {
      const { role } = user;
      const { isValid } = await this.authorize(role);
      return isValid;
    }
    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  async authorize(role: USER_TYPE): Promise<{ isValid: boolean }> {
    return {
      isValid: Object.values(UserService.USER_TYPE).includes(role),
    };
  };
}