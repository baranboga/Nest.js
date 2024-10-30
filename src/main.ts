import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('The NestJS API description')
    .setVersion('1.0')
    .addBearerAuth() // JWT authentication için
    .build();
  // Swagger configuration
  
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      //fazladan gelen veriyi engellemek için whitelist: true diyerek sadece gelen veriyi kabul eder.
      whitelist: true,
    }),
    
  );
  await app.listen(3333);
}
bootstrap();


// {
//   "email": "baran@gmail.com",
//   "password": "123"
// }

//1-Docker da bir veri tabanı ayağa kaldırdık.
//PC de önce docker açılacak
//-Docker compose dosyası oluşturduk ve içine veritabanı bilgilerini yazdık.
//-docker-compose up -d komutu ile veritabanını ayağa kaldırdık.
//- npx prisma studio  


//2-Prisma paketlerini yükledik ve prisma init komutu ile prisma dosyalarını oluşturduk.
//3-Prisma schema dosyasını oluşturduk. ve schema dosyasını güncelledik.
//4-Prisma migrate oluşturduk. bunun için prisma migrate dev komutunu çalıştırdık.
//5-prisma generate ile prisma tablolarımızın typescript dosyalarını oluşturduk. bunları kodumuzda kullanabiliriz.
//6-nest g module prisma komutu ile prisma module oluşturduk.Artık buradan prisma ya diğer modüllerden erişebiliriz.

//7-Prisma modulünde veya herhangi bir modulü başka bir yerden çağırmak için import etmemiz gerekiyor. bunun içim
//prisma modülüne @Global() decorator eklememiz gerekiyor. ve export etmemiz gerekiyor.

//DTO: Data Transfer Object
//8-Nest.js Dto ları için class-validator paketini kullandık. bunun için npm install class-validator class-transformer paketlerini yükledik.
//Nest.js de Dto lar kullanılır. Dto ların amacı gelen veriyi kontrol etmek ve düzenlemek.
//9-AuthDto.ts dosyasını oluşturduk ve içine class-validator paketini kullanarak bir class oluşturduk.
// ve bu classı kullanarak gelen veriyi kontrol ettik.
//Nest de validation işlemleri için ValidationPipe kullanılır. bunu main.ts dosyasında global olarak tanımladık.
//10-AuthDto.ts dosyasını kullanarak auth.controller.ts dosyasında gelen veriyi kontrol ettik.
//Dikkat! Dtolar sadece gelen veriyi kontrol etmek için kullanılır. veritabanına kayıt yapmak için kullanılmaz.

//SİNG UP İŞLEMİ
//Şifreyi hashlemek için argon2 paketini kullandık. bunun için npm install argon2 paketini yükledik.  
//email alanını birden fazla  kayıt yaptırmamak için prisma da unique alan olarak tanımladık.
//RELATIONSHIPS
//User ile book mark arasında one to many ilişki var. bir user birden fazla bookmark oluşturabilir.
//  user   User @relation(fields: [userId], references: [id]) bunu tanımladığımız zaman otomatik olarak 
//user a bookmarks Bookmark[] bunu ekler.
//Schema da bir değişiklik yaptığımız zaman prisma migrate dev komutu ile değişiklikleri kaydederiz.
//500 hatalarında kullanıcıya hata mesajı göstermek için ForbiddenException kullanırız. try catch bloğu içinde hata yakalarız.

//SİNG IN İŞLEMİ
//1-Kullanıcıya token vermek için jwt paketini kullandık. bunun için npm install @nestjs/jwt @nestjs/config paketlerini yükledik.
//Sing in de de sign up da kullandığımız  aynı dto yu kullandık. ve kullanıcıyı bulduk. ve kullanıcıyı bulduktan sonra token oluşturduk.
//2-Auth.service.ts dosyasında jwtService ve ConfigService i inject ettik.

//Bilgilerin güvenliği için nestconfig pakedini kullanırız. bu paket ile bilgileri .env dosyasına atarız.
//App module dosyasında ConfigModule.forRoot({isGlobal: true}) diyerek tüm uygulamada kullanabiliriz.
//Config service i prisma service e inject ettik. ve prisma service de config service i inject ettik.
//database url i .env dosyasına atarak oradan çekiyoruz. Bu bize daha güvenli bir yapı sağlar.
//app.module de config tanımlarken isGlobal: true diyerek tüm uygulamada kullanabiliriz.

//Nest.js "passport" ve jtw kütüphanesi kullandık. 
//jwt kütüphanesi kullandık
//types passport-jwt kütüphanesini kullandık.

//"@nestjs/jwt": "^8.0.0",
//"@nestjs/passport": "^8.1.0",
//"passport-jwt": "^4.0.0",
// "@types/passport-jwt": "^3.0.6",


//bunlardan sonra jwt modülünü auth modülüne ekledik.
//Daha sonra controllerda dependency injection yaparak jwt modülünü kullanıma hazır hale getirdik.

//1-İlk olarak kullanıcı sing in yaptığı zaman kullanacağımız bir end point oluşturduk.
//2-Bu endpoint signin. Daha sonra servis katmamında singin fonksiyonunu oluşturduk.
//Kullanıcı giriş yaptıktan sonra kullanıcıya token vermek için jwt paketini kullandık.
//Bunun için singin fonksiyonunda singToken fonksiyonunu kullanarak kullanıcıya özel bir token oluşturduk.

//3-Şimdide token stratejisi oluşturacağız. Bunun için passport ve jwt kütüphanelerini kullanacağız.
// işlem yaptıktan sonra mevcut token ı geçerli mi değil mi kontrol etmemiz gerekiyor.Buna Token stratejisi denir.

//Bunun için aynı service gibi bir jwt.strategy.ts dosyası oluşturduk.
//Bu dosyanın içerisine jwt strategy sınıfını oluşturduk. ve bu sınıfı passport strategy sınıfından extend ettik.
//Buradaki fonksiyonu artık kullanıcı istek attığı zaman tokenını validate etmek için kullanacağız.



//MODULE PROVİDER VE İMPORTS FARKI 
// IMPORTS
// imports dizisi, modülün bağımlılıklarını içerir. Bu, diğer modülleri ve gerekli yapılandırmaları içerir.
//  Örneğin, JwtModule.register({}) gibi modülleri buraya ekleyerek, modülünüzde JWT işlevselliğini kullanabilirsiniz.


// PROVIDERS
// providers dizisi, NestJS tarafından enjekte edilecek servisleri içerir. 
// Bu servisler, uygulamanızın iş mantığını içerir ve diğer bileşenlerde kullanılabilir.
//  AuthService ve JwtStrategy gibi servisler burada yer alır.

//Token strateji denemesi yapmak için user controller dosyası ve  bir endpoint oluşturduk.
//GUARDLAR
//Burada Guard kullanırız çünkü kullanıcının token ı geçerli mi değil mi kontrol etmemiz gerekiyor.
//ona göre işlem yapacağız. Guardlar middleware gibi çalışır. ve isteği kontrol eder.
//Guardımızı JtwGuard adında bir dosya oluşturduk. ve bu dosyada AuthGuard('jwt') sınıfını extend ettik.
//UseGuards(JwtGuard) decoratorunu kullanarak controllerda kullanıcıdan gelen isteği kontrol edebiliriz.
//Nest passport zaten guard içeriğine sahip. biz sadece bunu kullanacağız.

//1-
// @UseGuards(JwtGuard)   //bu controller a sadece login olan kullanıcılar erişebilir.
// @Controller('users')
// export class UserController {
//   constructor(private userService: UserService) {}
//   @Get('me')
//   getMe(@GetUser() user: User) {
//     return user;
//   }

//2-
// import { AuthGuard } from '@nestjs/passport';

// export class JwtGuard extends AuthGuard('jwt') {
//   constructor() {
//     super();
//   }
// }

//Burada "jtw" stringi "jwt" stringi ile aynı olmalıdır.
// "jwt" stringi "src/auth/strategy/jwt.strategy.ts"  dosyasında tanımlanmıştır. Buraya referans veririz.

//Guardın çalışma mantığı kısaca şöyledir;

// 1-İstek Geldiğinde: İstek controller'a ulaştığında, JwtGuard çalışır.
// 2-Guard'ın Çalışması: JwtGuard, JwtStrategy'yi kullanarak JWT'yi doğrular ve kullanıcı bilgilerini validate metodunda elde eder.
//2. JwtStrategy'nin Validate Metodu
// 3-Kullanıcı Bilgilerinin Eklenmesi: Doğrulanan kullanıcı bilgileri request.user içine eklenir.
// 4-Controller'da Kullanıcı Bilgilerini Yakalama: GetUser dekoratörü kullanılarak request.user içindeki kullanıcı bilgileri alınır ve controller metoduna parametre olarak geçilir.

//NEST JS SORGU İŞLEMLERİ



//   // 1. Create (Ekleme) - Yeni bir kullanıcı ekler

//   async createUser(data: { email: string; name?: string }) {
//     return await this.prisma.user.create({
//       data, // Yeni bir kullanıcı eklenir
//     });
//   }

//   // 2. Find Unique (Tekil Bulma) - ID veya başka benzersiz bir alan ile kullanıcı bulur

//   async findUserById(userId: number) {
//     return await this.prisma.user.findUnique({
//       where: { id: userId }, // Yalnızca ID eşleşen tekil bir kullanıcı döndürülür
//     });
//   }

//   // 3. Find First (İlk Bulma) - Belirli koşulları sağlayan ilk kullanıcıyı bulur

//   async findFirstUser(email: string) {
//     return await this.prisma.user.findFirst({
//       where: { email }, // İlk eşleşen kullanıcı döndürülür
//     });
//   }

//   // 4. Find Many (Çoğul Bulma) - Belirli koşullara uyan tüm kullanıcıları bulur

//   async findUsersByCondition(condition: { isActive?: boolean }) {
//     return await this.prisma.user.findMany({
//       where: condition, // Şartlara uyan tüm kullanıcılar döndürülür
//       orderBy: { createdAt: 'desc' }, // İsteğe bağlı: Son eklenenden ilk eklenene doğru sıralanır
//     });
//   }

//   // 5. Update (Güncelleme) - ID ile kullanıcı günceller

//   async updateUser(userId: number, data: { email?: string; name?: string }) {
//     return await this.prisma.user.update({
//       where: { id: userId }, // Güncellenecek kullanıcı ID ile seçilir
//       data: { 
//           email: data.email, // Eğer data.email varsa, email alanını günceller
//           name: data.name    // Eğer data.name varsa, name alanını günceller
//       } 
//   });
// }

//   // 6. Delete (Silme) - ID ile kullanıcı siler

//   async deleteUser(userId: number) {
//     return await this.prisma.user.delete({
//       where: { id: userId }, // Belirtilen ID'ye sahip kullanıcı silinir
//     });
//   }

//   // 7. Upsert (Güncelle ya da Ekle) - Eğer kullanıcı varsa günceller, yoksa ekler

//   async upsertUser(email: string, data: { name?: string }) {
//     return await this.prisma.user.upsert({
//       where: { email }, // E-posta adresine göre kullanıcı aranır
//       update: data, // Eğer kullanıcı varsa güncellenir
//       create: { email, ...data }, // Yoksa yeni bir kullanıcı eklenir
//     });
//   }

//   // 8. Aggregation (Toplu İşlemler) - Kullanıcı sayısı ve diğer toplu işlemler

//   async countActiveUsers() {
//     return await this.prisma.user.count({
//       where: { isActive: true }, // Aktif kullanıcı sayısı döndürülür
//     });
//   }

//   // 9. Group By - Kullanıcıları belirli bir alana göre gruplar

/// Kullanıcıları "status" alanına göre gruplar ve her gruptaki kullanıcı sayısını döndürür
// async groupUsersByStatus() {
//   return await this.prisma.user.groupBy({
//       by: ['status'], // "status" alanına göre gruplar
//       _count: { 
//           _all: true // Her gruptaki toplam kullanıcı sayısını döndürür
//       },
//       // İsteğe bağlı olarak diğer aggregate işlemlerini ekleyebilirsiniz:
//       _sum: {
//           age: true, // Her gruptaki yaşların toplamını döndürür (örnek)
//       },
//       _avg: {
//           age: true, // Her gruptaki yaşların ortalamasını döndürür (örnek)
//       },
//       _min: {
//           createdAt: true // Her gruptaki en eski "createdAt" değerini döndürür (örnek)
//       },
//       _max: {
//           createdAt: true // Her gruptaki en yeni "createdAt" değerini döndürür (örnek)
//       }
//   });
// }

//   // 10. Select (Seçim) - Belirli alanları seçerek kullanıcıyı döndürür

//   async selectUserFields(userId: number) {
//     return await this.prisma.user.findUnique({
//       where: { id: userId },
//       select: {
//         id: true,
//         email: true, // Sadece ID ve e-posta alanları döndürülür
//       },
//     });
//   }

//   // 11. Include (İlişkisel Veri Getirme) - Kullanıcı ile ilişkili verilere ulaşır

//   async getUserWithPosts(userId: number) {
//     return await this.prisma.user.findUnique({
//       where: { id: userId },
//       include: {
//         posts: true, // Kullanıcı ile ilişkili tüm gönderiler döndürülür
//       },
//     });
//   }

//   // 12. Nested Writes (İlişkisel Yazma) - Kullanıcıya yeni bir gönderi ekler
// Nested Writes, bir kayıt oluşturulurken veya güncellenirken ilişkili verilerin (örneğin, bir kullanıcının sahip olduğu yer işaretleri) aynı işlemde yazılmasına olanak tanır. 
// Yani, kullanıcıyı oluştururken, kullanıcıya ait bookmark'ları da birlikte oluşturabilirsiniz.

//   async createUserWithPost(data: {
//     email: string;
//     name: string;
//     postTitle: string;
//   }) {
//     return await this.prisma.user.create({
//       data: {
//         email: data.email,
//         name: data.name,
//         posts: {
//           create: { title: data.postTitle }, // Kullanıcı ile birlikte bir gönderi oluşturur
//         },
//       },
//     });
//   }

//   // 13. Transaction (İşlem) - Bir dizi sorguyu tek bir işlemde yürütür
//   async createUserAndPost(email: string, postTitle: string) {
//     return await this.prisma.$transaction([
//       this.prisma.user.create({ data: { email } }),
//       this.prisma.post.create({ data: { title: postTitle, authorEmail: email } }),
//     ]);
//   }

// Tüm sorgular ya birlikte başarılı olur ya da hiçbiri uygulanmaz. 
// Yani, eğer kullanıcı oluşturma işlemi başarılı ama post oluşturma işlemi başarısız olursa, kullanıcı kaydı da geri alınır.
//  Bu, veritabanınızda tutarlılığı sağlar.


//   // 14. Raw Query (Ham Sorgu) - Özel SQL sorguları yürütür
//   async getRawUserData() {
//     return await this.prisma.$queryRaw`SELECT * FROM User;`; // SQL sorgusu ile kullanıcıları döndürür
//   }
// }



