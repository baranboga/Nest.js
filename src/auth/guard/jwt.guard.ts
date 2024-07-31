import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}

//buradaki "jtw" stringi "jwt" stringi ile aynı olmalıdır. "jwt" stringi "src/auth/strategy/jwt.strategy.ts" dosyasında tanımlanmıştır.
