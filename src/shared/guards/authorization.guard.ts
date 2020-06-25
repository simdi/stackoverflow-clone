import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { HelperService } from "../helpers/helper";

const crud = {
  get: 'r',
  post: 'c',
  put: 'u',
  patch: 'u',
  delete: 'd',
};

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, method, url } = request;

    if (user) {
      const { permissions } = user;
      const { isValid } = await this.authorize(permissions, { domain: 'www', fingerprint: url.split(HelperService.APP_PREFIX)[1], method });
      return isValid;
    }
    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  async authorize(permissions: {}, { domain, method, fingerprint }): Promise<{ isValid: boolean }> {
    return {
      isValid: !!permissions[domain].find(({ slug }, i, arr) => {
        return (
          arr[i][crud[method.toLowerCase()]] && [0, 1].includes(fingerprint.toLowerCase().search(slug.toLowerCase()))
        );
      }),
    };
  };
}