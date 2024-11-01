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

// validate fonksiyonu, JWT doğrulandıktan sonra otomatik olarak çağrılır. İşleyişin nasıl gerçekleştiğini adım adım açıklayayım:

//1- JWT Doğrulaması:

// super({...}) kısmında, passport-jwt kütüphanesi, verilen JWT token'ını doğrulamak için gereken ayarları yapar. Bu ayarlar, token'ın nereden alınacağını (jwtFromRequest) ve hangi anahtarın kullanılacağını (secretOrKey) içerir.

//2- Token'ın Alınması:

// İstek geldiğinde, koruyucu (guard) JwtStrategy'yi çağırır. Bu aşamada, ExtractJwt.fromAuthHeaderAsBearerToken() kullanılarak istek başlığından JWT alınır.7

// 3- Doğrulama Süreci:

// JWT doğrulandığında, passport-jwt kütüphanesi otomatik olarak token içindeki payload'ı çıkarır. Payload, genellikle kullanıcının kimliğini (sub) ve diğer bilgileri içerir.
// validate Fonksiyonunun Çağrılması:

// JWT doğrulandıktan sonra, validate fonksiyonu çağrılır. Bu metod, çıkarılan payload'ı alır. Payload içindeki kullanıcı kimliğine (sub) dayanarak, veritabanında kullanıcının bilgilerini bulur.
// Kullanıcı Bilgilerinin Döndürülmesi:

// validate fonksiyonu, bulduğu kullanıcı nesnesini döndürür. Bu kullanıcı nesnesi, NestJS tarafından request.user içine eklenir. Böylece, koruyucu geçerli bir kullanıcı nesnesi sağlar.
// Özetle, validate fonksiyonu, JWT doğrulama sürecinin doğal bir parçası olarak çağrılır ve başarılı bir doğrulamadan sonra kullanıcının bilgilerini almak için kullanılır. Bu, tüm sürecin otomatik ve kesintisiz bir şekilde işlemesini sağl