import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';

@Module({
  imports: [JwtModule.register({
    
  })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

// ============= JWT VE AUTHENTICATION NOTLARI =============

// 1. KURULUM
// JWT ve authentication mekanizması için gerekli olan kütüphanelerin yüklenmesi:
// npm install @nestjs/jwt @nestjs/passport passport passport-jwt
// npm install -D @types/passport-jwt
// npm install @nestjs/config

// 2. JWT STRATEGY OLUŞTURMA
/*
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Token'ı Bearer header'ından al
      secretOrKey: 'your-secret-key', // Gizli anahtar .env dosyasından alınmalı
    });
  }

  validate(payload: { sub: number; email: string }) {
    return { id: payload.sub, email: payload.email }; // Kullanıcı bilgilerini döndür
  }
}
*/

// 3. JWT GUARD OLUŞTURMA
/*
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super(); // Parent sınıfın constructor'ını çağır
  }
}
*/

// 4. AUTH MODULE YAPILANDIRMASI
/*
@Module({
  imports: [
    JwtModule.register({
      secret: 'your-secret-key', // .env dosyasından alınmalı
      signOptions: { expiresIn: '15m' }, // Token süresi
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
*/



// 5. TOKEN OLUŞTURMA (AUTH SERVICE)
/*
async signToken(userId: number, email: string): Promise<string> {
  const payload = {
    sub: userId, // Kullanıcı kimliği
    email,
  };
  return this.jwtService.signAsync(payload); // Token'ı asenkron olarak oluştur
}
*/

// 6. GUARD KULLANIMI
/*
@UseGuards(JwtGuard)
@Get('me')
getMe(@GetUser() user: User) {
  return user; // İlgili kullanıcının bilgilerini döndür
}
*/

// 7. AUTHENTICATION AKIŞI
// 1) Kullanıcı signin/signup yapar
// 2) Token oluşturulur ve kullanıcıya döndürülür
// 3) Kullanıcı protected route'lara istek yaparken token'ı header'a ekler
// 4) JwtGuard token'ı kontrol eder
// 5) JwtStrategy token'ı validate eder
// 6) Validate başarılıysa request.user'a kullanıcı bilgileri eklenir

// 8. CUSTOM USER DECORATOR
/*
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user[data]; // İlgili alanı döndür
    }
    return request.user; // Tüm kullanıcı bilgilerini döndür
  },
);
*/

// 9. ÖNEMLİ NOKTALAR
// - JWT gizli anahtarının .env dosyasında saklanması güvenlik açısından kritik.
// - Token sürelerinin (örn: 15 dakika) kullanıcı deneyimi ve güvenlik dengesi gözetilerek belirlenmesi.
// - Token payload'ında hassas bilgilerin (şifre gibi) saklanmaması gerektiği.
// - Token blacklist/whitelist mekanizmasının uygulanması, kötüye kullanımları önlemek için önemlidir.
// - Refresh token mekanizması, kullanıcıların uzun süreli oturum açmalarını sağlar.

// 10. HATA YÖNETİMİ
// - Token süresi dolduğunda 401 Unauthorized hatası döner.
// - Geçersiz token durumunda UnauthorizedException fırlatılır.
// - Hata yönetimi için try-catch blokları ile kontrol yapılmalıdır.

// 11. GUARD ÇALIŞMA MANTIĞI
// 1) İstek controller'a ulaştığında JwtGuard devreye girer.
// 2) JwtGuard, JwtStrategy kullanarak JWT'yi doğrular.
// 3) Validate metodu çağrılır ve kullanıcı bilgileri elde edilir.
// 4) Doğrulanan bilgiler request.user içerisine eklenir.
// 5) GetUser dekoratörü ile bu bilgiler controller içerisinde alınabilir.

