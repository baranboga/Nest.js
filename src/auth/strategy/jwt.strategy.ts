import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({   //super({...}): Burada JWT doğrulaması yapılır ve JWT içindeki payload çıkarılır.
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  //super({}): Burada JWT doğrulaması yapılır ve JWT içindeki payload çıkarılır.
  //daha sonra validate metodu çağrılır ve payload içindeki kullanıcı kimliği alınır.

  async validate(payload: {  //validate(payload: { sub: number; email: string }): Bu metod, JWT doğrulandıktan sonra çağrılır ve JWT'nin içindeki payload'ı alır.
    sub: number;  //payload.sub: Kullanıcının kimliği.
    email: string;  //payload.email: Kullanıcının e-posta adresi.
  }) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: payload.sub,   //payload.sub JWT içindeki kullanıcı kimliğini temsil eder ve genellikle bir sayısal id veya benzeri bir kimlik bilgisini içerir.
        },
      });
    delete user.hash;
    return user;     //Bulunan kullanıcı nesnesi döndürülür. Bu kullanıcı nesnesi, NestJS tarafından request.user içine eklenir.
  }
}
